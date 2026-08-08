import type { SubscriptionStatus } from '@/lib/types/database'

// 'trialing' is the default status for a professional profile that has never
// completed checkout — it is not a real Stripe trial (no trial_period_days is
// configured). Any status other than 'active' (trialing/past_due/canceled) is
// the free tier: visible in the directory, capped at
// FREE_TIER_MONTHLY_REQUEST_LIMIT requests per month. Only a subscription
// Stripe reports as 'active' unlocks unlimited requests, the verified badge
// eligibility, and search priority.
export const ACTIVE_SUBSCRIPTION_STATUSES: SubscriptionStatus[] = ['active']

export function hasActiveSubscription(status: SubscriptionStatus | null | undefined) {
  return status != null && ACTIVE_SUBSCRIPTION_STATUSES.includes(status)
}

// Free-tier professionals can receive contact from at most this many
// distinct clients per calendar month. A client who already contacted them
// this month never gets blocked by their own repeat messages — only a new
// client past the limit does (see lib/freeTier.ts).
export const FREE_TIER_MONTHLY_REQUEST_LIMIT = 5
