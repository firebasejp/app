export {
  setAnalyticsCollectionEnabled,
  setCurrentScreen,
  setUnavailabilityLogging,
  setUserId,
  setUserProperties,
  setUserProperty,
  setSessionTimeoutDuration,
  resetAnalyticsData,
} from 'expo-firebase-analytics';
import * as ExpoAnalytics from 'expo-firebase-analytics';

export type Currency = string | number;

export type Item = {
  affiliation?: string;
  coupon?: string;
  creative_name?: string;
  creative_slot?: string;
  discount?: Currency;
  index?: number;
  item_brand?: string;
  item_category?: string;
  item_category2?: string;
  item_category3?: string;
  item_category4?: string;
  item_category5?: string;
  item_id: string;
  item_list_id?: string;
  item_list_name?: string;
  item_name?: string;
  item_variant?: string;
  location_id?: string;
  price?: Currency;
  promotion_id?: string;
  promotion_name?: string;
  quantity?: number;
};

export type AddToStockEventName = 'add_to_stock';
export type AddToStockEventParams = {
  items: Item[];
};

export type RemoveFromStockEventName = 'remove_from_stock';
export type RemoveFromStockEventParams = {
  items: Item[];
};

/**
 * Share event. Apps with social features can log the Share event to identify the most viral content
 */
export type ShareEventName = 'share';
export type ShareEventParams = {
  content_type: 'event' | 'video' | 'blog' | 'who_use';
  item_id: string;
  method: string;
};

/**
 *  This general purpose event signifies that a user has selected some content of a certain type in an app. The content can be any object in your app. This event can help you identify popular content and categories of content in your app.
 */
export type SelectContentEventName = 'select_content';
export type SelectContentEventParams = {
  content_type: 'event' | 'video' | 'blog' | 'who_use';
  item_id: string;
};

/**
 * This event signifies that an item was selected by a user from a list. Use the appropriate parameters to contextualize the event. Use this event to discover the most popular items selected.
 */
export type SelectItemEventName = 'select_item';
export type SelectItemEventParams = {
  items?: Item[];
  item_list_id?: string;
  item_list_name?: string;
};

/**
 * This event signifies that a user has viewed an item. Use the appropriate parameters to contextualize the event. Use this event to discover the most popular items viewed in your app. Note: If you supply the Param#VALUE parameter, you must also supply the Param#CURRENCY parameter so that revenue metrics can be computed accurately.
 */
export type ViewItemEventName = 'view_item';
export type ViewItemEventParams = {
  currency?: string;
  items?: Item[];
  value?: number;
};

/**
 * Log this event when a user sees a list of items or offerings
 */
export type ViewItemListEventName = 'view_item_list';
export type ViewItemListEventParams = {
  items?: Item[];
  item_list_id?: string;
  item_list_name?: string;
};

// logEvent function
export async function logEvent(
  name: AddToStockEventName,
  params: AddToStockEventParams,
): Promise<void>;
export async function logEvent(
  name: RemoveFromStockEventName,
  params: RemoveFromStockEventParams,
): Promise<void>;
export async function logEvent(
  name: ShareEventName,
  params: ShareEventParams,
): Promise<void>;
export async function logEvent(
  name: SelectContentEventName,
  params: SelectContentEventParams,
): Promise<void>;
export async function logEvent(
  name: SelectItemEventName,
  params: SelectItemEventParams,
): Promise<void>;
export async function logEvent(
  name: ViewItemEventName,
  params: ViewItemEventParams,
): Promise<void>;
export async function logEvent(
  name: ViewItemListEventName,
  params: ViewItemListEventParams,
): Promise<void>;
export async function logEvent(
  name: string,
  params: { [key: string]: unknown } | undefined,
): Promise<void> {
  if (__DEV__) {
    /* eslint-disable-next-line no-console */
    console.debug({ name, params });

    return;
  }

  return ExpoAnalytics.logEvent(name, params);
}
