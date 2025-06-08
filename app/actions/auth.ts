"use server";

import { createClient } from "@/supabase/server";

type SignInParams = {
  email: string;
  password: string;
};
export const signIn = async ({ email, password }: SignInParams) => {
  // try {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { data: null, error: error.message }; // Return plain string, not Error object
  }

  return { data, error: null };
  // } catch (error) {
  //   return error;
  // }
};

export const getAdmin = async () => {
  // try {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    return { data: null, error: error.message }; // Return plain string, not Error object
  }

  return { data, error: null };
  // } catch (error) {
  //   return error;
  // }
};

export const signOut = async () => {
  // try {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();
  if (error) {
    return { error: error.message }; // Return plain string, not Error object
  }
  return { error: null };
  // } catch (error) {
  //   return error;
  // }
};
