import {
  AuthResponse,
  OAuthResponse,
  UserResponse,
  createClient,
} from "@supabase/supabase-js";
import { Database } from "./SupabaseTypes";
import { useState } from "react";
const baseUrl = "http://localhost:3000";

export const supabase = createClient<Database>(
  "https://xrghboiijmfbfjnwpglw.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhyZ2hib2lpam1mYmZqbndwZ2x3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTE3ODMwOTYsImV4cCI6MjAyNzM1OTA5Nn0.YpUlK2BFWiwUFy1n8Tfmme8QSoiTF4CnMuJnnm3l2cQ"
);

export async function signUp(
  email: string,
  password: string
): Promise<AuthResponse> {
  const response = await supabase.auth.signUp({
    email: email,
    password: password,
  });

  if (response.data.user) {
    const uuid = response.data.user.id;
    const userData = {
      uuid: uuid,
    };
    const { data, error } = await supabase
      .from("t-app")
      .insert([userData])
      .select();

    if (error) {
      console.log(error);
    }
  }

  return response;
}

export async function signIn(
  email: string,
  password: string
): Promise<AuthResponse> {
  return await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });
}

export async function googleButton(): Promise<OAuthResponse> {
  return await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: baseUrl + "/dashboard",
    },
  });
}

export async function getSession(): Promise<any> {
  return await supabase.auth.getSession();
}

export async function logout() {
  console.log("logout");
  await supabase.auth.signOut();
}

export async function sendResetEmail(email: string): Promise<any> {
  return await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: baseUrl + "/resetpassword",
  });
}

export async function resetPassword(
  new_password: string
): Promise<UserResponse> {
  return await supabase.auth.updateUser({ password: new_password });
}

export async function fetchOnboarded(id: String): Promise<any> {
  let { data, error } = await supabase
    .from("t-app")
    .select("lang")
    .eq("uuid", id)
    .single();

  if (error) {
    console.log(error);
  }

  console.log("OnboardedData: ", data);
  return data !== null && data.lang !== null
}

export async function onboardUser(
  id: string,
  lang: string,
  audio_id: string,
  classification: string
): Promise<any> {
  const { data, error } = await supabase
    .from("t-app")
    .update({ lang: lang, audio_id: audio_id, classification: classification })
    .eq("uuid", id);
  if (error) {
    console.log(error);
  }
  return data;
}

export const apiUrl = "http://localhost:8000"