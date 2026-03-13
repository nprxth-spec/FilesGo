import { NextResponse } from "next/server";
import Stripe from "stripe";
import { auth } from "@/lib/auth";

export const runtime = "nodejs";

async function getOrCreateCustomer(stripe: Stripe, email: string, userId: string) {
  const existing = await stripe.customers.list({
    email,
    limit: 1,
  });
  if (existing.data.length > 0) {
    return existing.data[0].id;
  }

  const created = await stripe.customers.create({
    email,
    metadata: { userId },
  });
  return created.id;
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id || !session.user.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  const stripePriceId = process.env.STRIPE_PRICE_ID;

  if (!stripeSecretKey || !stripePriceId) {
    return NextResponse.json(
      { error: "Stripe is not configured. Please set STRIPE_SECRET_KEY and STRIPE_PRICE_ID." },
      { status: 500 }
    );
  }

  const stripe = new Stripe(stripeSecretKey);

  try {
    const customerId = await getOrCreateCustomer(
      stripe,
      session.user.email!,
      session.user.id
    );

    // Check if subscription already exists for this price
    const existingSubs = await stripe.subscriptions.list({
      customer: customerId,
      status: "all",
      expand: ["data.items"],
      limit: 10,
    });

    const alreadySubscribed = existingSubs.data.some((sub) =>
      sub.items.data.some((item) => item.price.id === stripePriceId)
    );

    if (alreadySubscribed) {
      return NextResponse.json({ status: "already_active" });
    }

    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: stripePriceId }],
      expand: ["latest_invoice.payment_intent"],
    });

    const latestInvoice: any = subscription.latest_invoice;
    const paymentIntent = latestInvoice?.payment_intent;

    if (paymentIntent && paymentIntent.status === "requires_action") {
      // For strong customer authentication you would need to handle this
      // client-side with stripe.confirmCardPayment. For now we surface an
      // error message so the user can complete the flow in Stripe instead.
      return NextResponse.json(
        {
          status: "requires_action",
          error:
            "Additional card authentication is required. Please open the Stripe billing portal to complete the upgrade.",
        },
        { status: 400 }
      );
    }

    return NextResponse.json({ status: "active" });
  } catch (err: any) {
    console.error("Stripe upgrade error:", err);
    return NextResponse.json(
      { error: err.message ?? "Failed to upgrade subscription." },
      { status: 500 }
    );
  }
}

