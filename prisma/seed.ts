import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const campaigns = await Promise.all([
    prisma.campaign.upsert({
      where: { id: 1 },
      update: {},
      create: {
        id: 1,
        campaignName: "DM workload angle",
        openingMessage: "Hey, quick question - do you handle your makeup booking DMs yourself?",
        positioningAngle: "DM workload",
        targetCategory: "bridal_mua",
        betaPrice: 499,
      },
    }),
    prisma.campaign.upsert({
      where: { id: 2 },
      update: {},
      create: {
        id: 2,
        campaignName: "Bridal inquiry angle",
        openingMessage: "Hey, small question - when brides message for makeup booking, do you reply yourself or someone from your team handles it?",
        positioningAngle: "Bridal booking pain",
        targetCategory: "bridal_mua",
        betaPrice: 499,
      },
    }),
    prisma.campaign.upsert({
      where: { id: 3 },
      update: {},
      create: {
        id: 3,
        campaignName: "Instagram vs WhatsApp angle",
        openingMessage: "Hey, do you usually get booking inquiries on Instagram DMs or mostly WhatsApp?",
        positioningAngle: "Channel workflow",
        betaPrice: 499,
      },
    }),
  ]);

  const prospect = await prisma.prospect.upsert({
    where: { instagramUsername: "glambyxyz" },
    update: {},
    create: {
      instagramUsername: "glambyxyz",
      artistName: "Glam By XYZ",
      city: "Delhi",
      state: "Delhi",
      followersCount: 18000,
      profileUrl: "https://instagram.com/glambyxyz",
      category: "bridal_mua",
      bioText: "Bridal and party makeup. DM for bookings.",
      campaignId: campaigns[0].id,
      status: "pain_confirmed",
      interestScore: 55,
      firstMessageSentAt: new Date("2026-04-27T12:00:00.000Z"),
      firstReplyAt: new Date("2026-04-27T16:15:00.000Z"),
      replyDelayMinutes: 255,
      lastMessageAt: new Date("2026-04-27T16:22:00.000Z"),
      notes: "Seed PRD workflow sample.",
    },
  });

  if ((await prisma.outreachMessage.count({ where: { prospectId: prospect.id } })) === 0) {
    await prisma.outreachMessage.createMany({
      data: [
        {
          prospectId: prospect.id,
          direction: "sent",
          channel: "instagram",
          messageText: "Hey, quick question - do you handle your makeup booking DMs yourself?",
          sentOrReceivedAt: new Date("2026-04-27T12:00:00.000Z"),
          isFirstMessage: true,
        },
        {
          prospectId: prospect.id,
          direction: "received",
          channel: "instagram",
          messageText: "Yes I handle myself.",
          sentOrReceivedAt: new Date("2026-04-27T16:15:00.000Z"),
          isFirstReply: true,
        },
        {
          prospectId: prospect.id,
          direction: "sent",
          channel: "instagram",
          messageText: "Got it. Do you get repeated DMs like price/available/bridal charges and then have to ask date, city and service type again?",
          sentOrReceivedAt: new Date("2026-04-27T16:18:00.000Z"),
        },
        {
          prospectId: prospect.id,
          direction: "received",
          channel: "instagram",
          messageText: "Yes many people ask price and then disappear.",
          sentOrReceivedAt: new Date("2026-04-27T16:22:00.000Z"),
        },
      ],
    });
  }

  for (const item of [
    {
        instagramUsername: "bridalglowstudio",
        artistName: "Bridal Glow Studio",
        city: "Mumbai",
        followersCount: 42000,
        category: "makeup_studio",
        campaignId: campaigns[1].id,
        bioText: "Luxury bridal makeup. WhatsApp for bookings.",
    },
    {
        instagramUsername: "makeupbynaina",
        artistName: "Naina MUA",
        city: "Chandigarh",
        followersCount: 9300,
        category: "bridal_mua",
        campaignId: campaigns[0].id,
    },
    {
        instagramUsername: "partylooks_ria",
        artistName: "Ria Party Looks",
        city: "Ludhiana",
        followersCount: 5200,
        category: "party_mua",
        campaignId: campaigns[2].id,
    },
    {
        instagramUsername: "academy_beautypro",
        artistName: "Beauty Pro Academy",
        city: "Jaipur",
        followersCount: 27000,
        category: "makeup_academy",
        campaignId: campaigns[1].id,
    },
  ]) {
    await prisma.prospect.upsert({
      where: { instagramUsername: item.instagramUsername },
      update: {},
      create: item,
    });
  }
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
