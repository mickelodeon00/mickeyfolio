"use server";

import { generateFileName } from "@/lib/utils";
import { createClient } from "@/supabase/server";
import { data } from "autoprefixer";


// server action

export async function uploadImage({ file, path }: {
  file: File;
  path: string;
}) {
  const supabase = await createClient();
  const fileName = generateFileName(file);

  const [bucket, ...pathArray] = path.split('/')
  const pathName = pathArray.length ? pathArray.join('/') : ''


  const { error } = await supabase.storage
    .from(bucket)
    .upload(`${pathName}/${fileName}`, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    return { error, data: null };
  }

  return { data: fileName, error: null }
}

