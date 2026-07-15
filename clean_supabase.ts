import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

async function cleanStorage() {
  console.log('Fetching files in uploads bucket...');
  const { data, error } = await supabaseAdmin.storage.from('uploads').list('', {
    limit: 1000,
    offset: 0,
    sortBy: { column: 'created_at', order: 'asc' },
  });

  if (error) {
    console.error('Error fetching files:', error);
    return;
  }

  if (!data || data.length === 0) {
    console.log('No files found to delete.');
    return;
  }

  // Filter out directories (like .emptyFolderPlaceholder)
  const filesToDelete = data.filter(file => file.id !== null).map(file => file.name);
  
  if (filesToDelete.length === 0) {
    console.log('Only folders found, nothing to delete.');
    return;
  }

  console.log(`Found ${filesToDelete.length} files. Deleting...`);
  
  const { data: deleteData, error: deleteError } = await supabaseAdmin.storage
    .from('uploads')
    .remove(filesToDelete);

  if (deleteError) {
    console.error('Error deleting files:', deleteError);
  } else {
    console.log(`Successfully deleted ${deleteData?.length || 0} files.`);
    console.log('Supabase storage should be cleared now!');
  }
}

cleanStorage();
