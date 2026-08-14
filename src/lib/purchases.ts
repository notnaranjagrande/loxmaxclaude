import { Platform } from "react-native";
import Purchases, { type PurchasesOffering, type CustomerInfo } from "react-native-purchases";

const API_KEY = process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY;
export const ENTITLEMENT_ID = "premium";

let configured = false;

export function configurePurchases(appUserId?: string) {
  if (configured || Platform.OS !== "ios") return;
  if (!API_KEY) {
    console.warn(
      "EXPO_PUBLIC_REVENUECAT_IOS_KEY missing. Copy .env.example to .env and fill it in."
    );
    return;
  }
  Purchases.configure({ apiKey: API_KEY, appUserID: appUserId });
  configured = true;
}

export async function getCurrentOffering(): Promise<PurchasesOffering | null> {
  const offerings = await Purchases.getOfferings();
  return offerings.current;
}

export async function purchasePackage(pkg: NonNullable<PurchasesOffering["availablePackages"]>[number]) {
  const { customerInfo } = await Purchases.purchasePackage(pkg);
  return hasActiveEntitlement(customerInfo);
}

export async function restorePurchases(): Promise<boolean> {
  const customerInfo = await Purchases.restorePurchases();
  return hasActiveEntitlement(customerInfo);
}

export async function checkEntitlement(): Promise<boolean> {
  if (!configured) return false;
  const customerInfo = await Purchases.getCustomerInfo();
  return hasActiveEntitlement(customerInfo);
}

function hasActiveEntitlement(customerInfo: CustomerInfo): boolean {
  return typeof customerInfo.entitlements.active[ENTITLEMENT_ID] !== "undefined";
}
