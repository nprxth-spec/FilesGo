import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

// Stripe needs raw body for signature verification — do not parse JSON before verify
export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET is not set");
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
  }

  const body = await request.text();
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature" }, { status: 400 });
  }

  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeSecretKey) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });
  }

  let event: Stripe.Event;
  try {
    const stripe = new Stripe(stripeSecretKey);
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error("Stripe webhook signature verification failed:", err.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (
    event.type !== "customer.subscription.created" &&
    event.type !== "customer.subscription.updated" &&
    event.type !== "customer.subscription.deleted"
  ) {
    return NextResponse.json({ received: true });
  }

  const subscription = event.data.object as Stripe.Subscription;
  const customerId = typeof subscription.customer === "string" ? subscription.customer : subscription.customer?.id;
  if (!customerId) {
    return NextResponse.json({ received: true });
  }

  const stripe = new Stripe(stripeSecretKey);
  let userId: string | null = null;

  try {
    const customer = await stripe.customers.retrieve(customerId);
    if (customer.deleted) {
      return NextResponse.json({ received: true });
    }
    userId = (customer.metadata?.userId as string) || null;
    if (!userId && customer.email) {
      const user = await prisma.user.findUnique({
        where: { email: customer.email },
        select: { id: true },
      });
      userId = user?.id ?? null;
    }
  } catch (e) {
    console.error("Failed to retrieve Stripe customer:", e);
    return NextResponse.json({ error: "Customer lookup failed" }, { status: 500 });
  }

  if (!userId) {
    console.warn("Webhook: could not resolve userId for customer", customerId);
    return NextResponse.json({ received: true });
  }

  const status = subscription.status;
  const plan = status === "active" || status === "trialing" ? "pro" : "free";

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { plan },
    });
  } catch (e) {
    console.error("Webhook: failed to update user plan:", e);
    return NextResponse.json({ error: "Database update failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
