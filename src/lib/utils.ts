/* eslint-disable @typescript-eslint/ban-ts-comment */
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const executeHaptic = () => {
  //@ts-ignore
  if (window.TelegramWebviewProxy) {
    // postEvent("web_app_trigger_haptic_feedback", {
    //   type: "impact",
    //   impact_style: "soft",
    // });
  }
};

export const executeHapticBurst = () => {
  //@ts-ignore
  if (window.TelegramWebviewProxy) {
    let impactCount = 0;
    const totalImpacts = 30;
    const interval = 1000 / totalImpacts;
    const impactInterval = setInterval(() => {
      if (impactCount >= totalImpacts) {
        clearInterval(impactInterval);
        return;
      }
      // postEvent("web_app_trigger_haptic_feedback", {
      //   type: "impact",
      //   impact_style: "soft",
      // });
      impactCount++;
    }, interval);
  }
};

// Random gradient generator for cards
export const getRandomGradient = () => {
  const gradients = [
    "from-blue-400 via-purple-500 to-transparent to-[70%]",
    "from-green-400 via-blue-500 to-transparent  to-[70%]",
    "from-yellow-400 via-red-500 to-transparent  to-[70%]",
    "from-purple-400 via-pink-500 to-transparent  to-[70%]",
    "from-indigo-400 via-purple-500 to-transparent  to-[70%]",
    "from-cyan-400 via-blue-500 to-transparent  to-[70%]",
    "from-teal-400 via-green-500 to-transparent  to-[70%]",
    "from-orange-400 via-red-500 to-transparent  to-[70%]",
    "from-rose-400 via-fuchsia-500 to-transparent  to-[70%]",
    "from-emerald-400 via-teal-500 to-transparent  to-[70%]",
  ];
  return gradients[Math.floor(Math.random() * gradients.length)];
};

// Copy text to clipboard
export const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error("Failed to copy text: ", err);
    return false;
  }
};
