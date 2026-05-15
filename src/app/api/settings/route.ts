import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import path from 'path';

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('settings')
    .select('*')
    .eq('id', 1)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Convertir snake_case a camelCase para el frontend
  return NextResponse.json({
    heroTitle:      data.hero_title,
    heroSubtitle:   data.hero_subtitle,
    heroCaption:    data.hero_caption,
    heroValueProp:  data.hero_value_prop,
    heroImage:      data.hero_image,
    heroVideo:      data.hero_video,
    heroFontSize:   data.hero_font_size,
    heroFontFamily: data.hero_font_family,
    heroMarquee:    data.hero_marquee,
    heroLinkText:   data.hero_link_text,
    whatsappNumber: data.whatsapp_number,
    instagramUrl:   data.instagram_url,
    facebookUrl:    data.facebook_url,
    tiktokUrl:      data.tiktok_url,
    mailUrl:        data.mail_url,
    logoUrl:        data.logo_url,
    aboutText:      data.about_text,
    faqText:        data.faq_text,
    termsText:      data.terms_text,
  });
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const updates: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    const heroTitle = formData.get('heroTitle') as string;
    if (heroTitle !== null) updates.hero_title = heroTitle;

    const heroSubtitle = formData.get('heroSubtitle') as string;
    if (heroSubtitle !== null) updates.hero_subtitle = heroSubtitle;

    const heroCaption = formData.get('heroCaption') as string;
    if (heroCaption !== null) updates.hero_caption = heroCaption;

    const heroValueProp = formData.get('heroValueProp') as string;
    if (heroValueProp !== null) updates.hero_value_prop = heroValueProp;

    const heroFontSize = formData.get('heroFontSize') as string;
    if (heroFontSize) updates.hero_font_size = heroFontSize;

    const heroFontFamily = formData.get('heroFontFamily') as string;
    if (heroFontFamily) updates.hero_font_family = heroFontFamily;

    const heroMarquee = formData.get('heroMarquee') as string;
    if (heroMarquee !== null) updates.hero_marquee = heroMarquee;

    const heroLinkText = formData.get('heroLinkText') as string;
    if (heroLinkText !== null) updates.hero_link_text = heroLinkText;

    const whatsappNumber = formData.get('whatsappNumber') as string;
    if (whatsappNumber) updates.whatsapp_number = whatsappNumber;

    // Manejo de imagen
    const heroImageFile = formData.get('heroImage') as File;
    if (heroImageFile && heroImageFile.size > 0) {
      const bytes = await heroImageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const ext = path.extname(heroImageFile.name);
      const filename = `hero-${Date.now()}${ext}`;

      const { error: uploadError } = await supabaseAdmin.storage
        .from('uploads')
        .upload(filename, buffer, { contentType: heroImageFile.type, upsert: true });

      if (!uploadError) {
        const { data: urlData } = supabaseAdmin.storage.from('uploads').getPublicUrl(filename);
        updates.hero_image = urlData.publicUrl;
      }
    }

    // Manejo de video
    const heroVideoFile = formData.get('heroVideo') as File;
    if (heroVideoFile && heroVideoFile.size > 0) {
      const bytes = await heroVideoFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const ext = path.extname(heroVideoFile.name);
      const filename = `hero-vid-${Date.now()}${ext}`;

      const { error: uploadError } = await supabaseAdmin.storage
        .from('uploads')
        .upload(filename, buffer, { contentType: heroVideoFile.type, upsert: true });

      if (!uploadError) {
        const { data: urlData } = supabaseAdmin.storage.from('uploads').getPublicUrl(filename);
        updates.hero_video = urlData.publicUrl;
      }
    }

    // Redes Sociales
    const instagramUrl = formData.get('instagramUrl') as string;
    if (instagramUrl !== null) updates.instagram_url = instagramUrl;

    const facebookUrl = formData.get('facebookUrl') as string;
    if (facebookUrl !== null) updates.facebook_url = facebookUrl;

    const tiktokUrl = formData.get('tiktokUrl') as string;
    if (tiktokUrl !== null) updates.tiktok_url = tiktokUrl;

    const mailUrl = formData.get('mailUrl') as string;
    if (mailUrl !== null) updates.mail_url = mailUrl;

    const aboutText = formData.get('aboutText') as string;
    if (aboutText !== null) updates.about_text = aboutText;

    const faqText = formData.get('faqText') as string;
    if (faqText !== null) updates.faq_text = faqText;

    const termsText = formData.get('termsText') as string;
    if (termsText !== null) updates.terms_text = termsText;

    // Logo
    const logoFile = formData.get('logoFile') as File;
    if (logoFile && logoFile.size > 0) {
      const bytes = await logoFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const ext = path.extname(logoFile.name);
      const filename = `logo-${Date.now()}${ext}`;

      const { error: uploadError } = await supabaseAdmin.storage
        .from('uploads')
        .upload(filename, buffer, { contentType: logoFile.type, upsert: true });

      if (!uploadError) {
        const { data: urlData } = supabaseAdmin.storage.from('uploads').getPublicUrl(filename);
        updates.logo_url = urlData.publicUrl;
      }
    }

    const { error } = await supabaseAdmin
      .from('settings')
      .update(updates)
      .eq('id', 1);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
