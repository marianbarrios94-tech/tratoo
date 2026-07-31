import type { SubscriptionStatus } from '@/lib/types/database'

// 'trialing' is the default status for a professional profile that has never
// completed checkout — it is not a real Stripe trial (no trial_period_days is
// configured), so it must not grant directory visibility or the ability to
// receive requests. Only a subscription Stripe reports as 'active' does.
export const ACTIVE_SUBSCRIPTION_STATUSES: SubscriptionStatus[] = ['active']

export function hasActiveSubscription(status: SubscriptionStatus | null | undefined) {
  return status != null && ACTIVE_SUBSCRIPTION_STATUSES.includes(status)
}
