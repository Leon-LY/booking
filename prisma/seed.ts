import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create admin user
  const adminPassword = await hash("admin123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@designpro.com" },
    update: {},
    create: {
      email: "admin@designpro.com",
      name: "Admin",
      password: adminPassword,
    },
  });
  console.log("Admin user created:", admin.email);

  // Create services
  const services = await Promise.all([
    prisma.service.create({
      data: {
        name: "Free Initial Consultation",
        summary: "30-minute free consultation to discuss your design needs and vision",
        description:
          "Meet with one of our expert designers for a free 30-minute consultation.\n\n" +
          "We'll discuss your project goals, budget, timeline, and design preferences. " +
          "This is a no-obligation session to help you understand how we can bring your vision to life.\n\n" +
          "After the consultation, you'll receive a summary of our discussion and recommended next steps.",
        price: 0,
        duration: 30,
        category: "consultation",
        sortOrder: 1,
      },
    }),
    prisma.service.create({
      data: {
        name: "Full Home Design Planning",
        summary: "Comprehensive 90-minute design planning session for your entire home",
        description:
          "A deep-dive design planning session for your complete home renovation or new build.\n\n" +
          "Our designer will work with you to create a cohesive design plan covering layout, " +
          "color schemes, materials, furniture selection, and lighting design.\n\n" +
          "You'll leave with a detailed design brief and mood board tailored to your style and budget.",
        price: 500,
        duration: 90,
        category: "design",
        sortOrder: 2,
      },
    }),
    prisma.service.create({
      data: {
        name: "Room-by-Room Design",
        summary: "60-minute focused design session for a single room",
        description:
          "Focused design consultation for one specific room of your choice.\n\n" +
          "Perfect for kitchen remodels, bathroom renovations, living room makeovers, " +
          "or any single-room project. Our designer will help you maximize space, " +
          "choose materials, and create a beautiful, functional design.\n\n" +
          "Bring photos and measurements of your space for the best results.",
        price: 300,
        duration: 60,
        category: "design",
        sortOrder: 3,
      },
    }),
    prisma.service.create({
      data: {
        name: "Material & Color Consultation",
        summary: "45-minute session to select materials, colors, and finishes",
        description:
          "Expert guidance on selecting the perfect materials, colors, and finishes for your project.\n\n" +
          "Our designers bring extensive knowledge of current trends, material durability, " +
          "and color theory to help you make confident decisions. We'll create a cohesive " +
          "palette that reflects your personal style while ensuring practical functionality.\n\n" +
          "Samples and catalogs will be available during the session.",
        price: 200,
        duration: 45,
        category: "consultation",
        sortOrder: 4,
      },
    }),
    prisma.service.create({
      data: {
        name: "Renovation Project Review",
        summary: "60-minute review of your renovation plans with expert feedback",
        description:
          "Already have renovation plans? Get professional feedback before you start.\n\n" +
          "Our experienced designers will review your existing plans, identify potential issues, " +
          "suggest improvements, and help you avoid costly mistakes. We'll cover layout efficiency, " +
          "material choices, budget optimization, and timeline planning.\n\n" +
          "Bring your plans, contractor quotes, and any inspiration images you've collected.",
        price: 350,
        duration: 60,
        category: "review",
        sortOrder: 5,
      },
    }),
  ]);
  console.log(`${services.length} services created`);

  // Create time slots (Monday to Saturday)
  const slotData = [];
  for (let day = 1; day <= 6; day++) {
    slotData.push(
      { dayOfWeek: day, startTime: "09:00", endTime: "12:00" },
      { dayOfWeek: day, startTime: "13:00", endTime: "18:00" }
    );
  }

  let slotCount = 0;
  for (const data of slotData) {
    await prisma.timeSlot.upsert({
      where: {
        dayOfWeek_startTime: {
          dayOfWeek: data.dayOfWeek,
          startTime: data.startTime,
        },
      },
      update: {},
      create: data,
    });
    slotCount++;
  }
  console.log(`${slotCount} time slots created`);

  // Create site settings
  const settings = [
    { key: "siteName", value: "DesignPro" },
    { key: "siteDescription", value: "Professional Design Consultation Booking" },
    { key: "contactPhone", value: "400-888-8888" },
    { key: "contactEmail", value: "hello@designpro.com" },
    { key: "contactAddress", value: "123 Design Street, Creative District" },
    { key: "businessHours", value: "Monday - Saturday, 9:00 AM - 6:00 PM" },
  ];

  for (const setting of settings) {
    await prisma.siteSetting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    });
  }
  console.log(`${settings.length} site settings created`);

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
