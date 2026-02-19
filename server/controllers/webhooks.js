import { Webhook } from "svix";
import User from "./models/User.js";

// **Webhook handler for Clerk events**
export const clerkWebhooks = async (req, res) => {
  // Clerk يبعت POST دايمًا، لو مش POST → نرفض فورًا
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }

  try {
    // 1. إنشاء webhook verifier باستخدام الـ secret من .env
    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    // 2. التحقق من صحة الطلب (مهم جدًا عشان الأمان)
    const payload = req.body; // في Next.js/Express لازم تتأكد إن body parser raw
    const headers = req.headers;

    const verifiedPayload = await wh.verify(JSON.stringify(payload), {
      "svix-id": headers["svix-id"],
      "svix-timestamp": headers["svix-timestamp"],
      "svix-signature": headers["svix-signature"],
    });

    // لو وصل هنا يبقى الطلب موثوق 100% من Clerk

    const { type, data } = verifiedPayload;

    // استخراج البيانات المهمة (بشكل أكثر أمانًا)
    const clerkUserId = data.id;
    const email = data.email_addresses?.[0]?.email_address;
    const firstName = data.first_name || "";
    const lastName = data.last_name || "";
    const fullName =
      [firstName, lastName].filter(Boolean).join(" ").trim() ||
      data.username ||
      (email ? email.split("@")[0] : "User");
    const imageUrl = data.image_url || data.profile_image_url;

    // البحث عن المستخدم في الداتابيز باستخدام id (أفضل من الإيميل)
    let user = await User.findOne({ id: clerkUserId });

    switch (type) {
      case "user.created":
        // لو موجود بالفعل (نادر لكن ممكن بسبب retry)، نحدثه
        if (user) {
          console.log(`User already exists: ${clerkUserId}`);
          break;
        }

        if (!email) {
          throw new Error("No email provided in user.created event");
        }

        const newUser = new User({
          id: clerkUserId,
          name: fullName,
          email,
          imageUrl,
          // أضف حقول إضافية لو عايز: role: 'user', createdAt: new Date(), etc.
        });

        await newUser.save();
        console.log(`New user created: ${clerkUserId} - ${email}`);
        break;

      case "user.updated":
        if (!user) {
          console.log(`User not found for update: ${clerkUserId}`);
          break;
        }

        await User.updateOne(
          { id: clerkUserId },
          {
            $set: {
              name: fullName,
              imageUrl,
              email,
              // أضف أي حقول تانية بتتحدث: phone, etc.
              updatedAt: new Date(),
            },
          },
        );
        console.log(`User updated: ${clerkUserId}`);
        break;

      case "user.deleted":
        if (user) {
          // خيار 1: حذف نهائي
          await User.deleteOne({ id: clerkUserId });
          console.log(`User deleted: ${clerkUserId}`);

          // خيار 2: soft delete (أفضل في معظم الحالات)
          // await User.updateOne({ id: clerkUserId }, { $set: { isDeleted: true, deletedAt: new Date() } });
        }
        break;

      default:
        console.log(`Unhandled Clerk event: ${type}`);
    }

    // Clerk بيحتاج response 200 عشان يعرف إن الويب هوك نجح
    return res
      .status(200)
      .json({ success: true, message: "Webhook processed" });
  } catch (error) {
    console.error("Clerk Webhook Error:", error.message);
    // مهم: لو خطأ في التحقق → نرجع 400 عشان Clerk يعيد المحاولة
    return res.status(400).json({
      success: false,
      message: error.message || "Webhook verification failed",
    });
  }
};
