const fs = require('fs');
const env = fs.readFileSync('.env', 'utf8');
let supabaseUrl = '';
let supabaseKey = '';
env.split('\n').forEach(line => {
  if (line.includes('SUPABASE_URL')) supabaseUrl = line.split('=')[1].trim();
  if (line.includes('SUPABASE_SERVICE_ROLE_KEY')) supabaseKey = line.split('=')[1].trim();
});

const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data, error } = await supabase
    .from('youtube_videos')
    .select('id, title, is_short')
    .ilike('title', '%');

  if (error) {
    console.error(error);
    return;
  }
  
  const keywords = [
    'mg',
    'holi',
    'vengurla',
    'who',
    'tree',
    'last ride',
    'hosteller'
  ];
  
  console.log('All videos matching keywords:');
  data.forEach(v => {
    const t = v.title.toLowerCase();
    if (keywords.some(k => t.includes(k))) {
      console.log(`- [${v.is_short ? 'SHORT' : 'LONG'}] ${v.title} (ID: ${v.id})`);
    }
  });
}

run();
