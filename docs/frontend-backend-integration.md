# دليل ربط Tablely Frontend بالـ Backend

هذا الملف يوثق ربط الفرونت إند بالـ API الحالي. مصدر الحقيقة للعقود هو مسارات الباك إند الحالية؛ أي تعديل عليها يحتاج تحديث هذا الدليل.

## 1. الوضع الحالي

- صفحات الموقع الحالية: Home، Explore، Restaurant Details، Login، Register، My Bookings، My Favorites، My Reviews.
- الخدمات تستخدم API الباك إند من خلال `src/js/services/api-client.js`، وترسل Cookies وCSRF عند الحاجة.
- بيانات المطاعم والحجوزات والمفضلة والتقييمات تأتي من API؛ لم تعد صفحات الحساب تعتمد على Mock Data أو Local Storage.
- لا تحفظ كلمة المرور أو JWT في Local Storage. المتصفح سيحفظ Cookie الجلسة التي يرسلها الباك.
- IDs المطاعم أرقام صحيحة يولدها MySQL. استخدم `restaurant.id` في الروابط والطلبات والعلاقات؛ لا تنشئ ID من الفرونت ولا تستخدم الاسم أو slug بدلًا منه.
- بيانات تسجيل المستخدم لا تتضمن رقم هاتف. التسجيل الحالي يطلب الاسم والبريد وكلمة المرور، ثم تأكيد البريد بكود OTP.

## 2. إعداد الاتصال

أضف عنوان الباك للبيئة المحلية في `.env` الخاص بالفرونت:

```env
VITE_API_BASE_URL=http://localhost:5002/api/v1
```

غيّر المضيف أو المنفذ إذا كان السيرفر يعمل على عنوان آخر. في Vercel أضف Environment Variable بنفس الاسم واجعله يشير إلى عنوان API المنشور، ثم أعد النشر.

كل طلب `fetch` يحتاج:

```js
credentials: 'include'
```

حتى يرسل Cookie الجلسة ويستقبل Cookies تسجيل الدخول. طلبات `POST` و`PUT` و`DELETE` المحمية تحتاج كذلك قراءة قيمة `csrf_access_token` من Cookie وإرسالها في الهيدر:

```http
X-CSRF-TOKEN: <قيمة csrf_access_token>
```

Cookie الجلسة `tablely_access_token` من نوع HttpOnly؛ لا تحاول قراءتها من JavaScript. بعد نجاح Login يستدعي الفرونت `GET /auth/me` لمعرفة حالة الجلسة. عند Logout يرسل CSRF Token أيضًا.

**نشر منفصل على Vercel:** يجب ضبط CORS في الباك على أصل الفرونت الفعلي مع السماح بالـ credentials. إعدادات Cookie مثل `Secure` و`SameSite` يجب أن تناسب نطاقي النشر عبر HTTPS؛ لو منع المتصفح Cookie بسبب سياسة النطاق أو المتصفح، يلزم تعديل إعدادات الباك والنشر معًا.

## 3. شكل الرد والأخطاء

كل رد API يستخدم الغلاف التالي:

```json
{
  "success": true,
  "message": "Restaurants loaded.",
  "data": {}
}
```

والخطأ:

```json
{
  "success": false,
  "message": "Check the restaurant filters.",
  "data": { "fields": { "q": "Search text cannot exceed 100 characters." } }
}
```

اقرأ `message` لرسالة عامة، و`data.fields` لعرض خطأ بجانب الحقل. أخطاء الصلاحيات قد ترجع `data.code` مثل `authentication_required` أو `email_not_verified`. لا تعتمد على نص الرسالة وحده لتحديد السلوك.

التعامل المطلوب في الواجهة:

- `401`: انتهت الجلسة أو المستخدم غير مسجل؛ حدّث حالة المستخدم ووجّهه إلى Login عند فتح صفحات الحساب.
- `403` مع `email_not_verified`: اعرض خطوة/رسالة التحقق ووجّه المستخدم إلى تجربة OTP.
- `403` مع `booking_required`: وضّح أن كتابة Review تتطلب حجزًا مؤكدًا.
- `409`: اعرض سبب التعارض المناسب، مثل Review موجود مسبقًا.
- `422`: اربط `data.fields` بحقول النموذج أو الفلتر.
- فشل الاتصال أو رد غير JSON: اعرض رسالة تعذر الاتصال مع خيار إعادة المحاولة.

## 4. عقود الصفحات والطلبات

كل المسارات التالية تضاف إلى الأساس `/api/v1`.

### Authentication

| العملية | الطلب | المدخلات | الاستخدام |
| --- | --- | --- | --- |
| إنشاء حساب | `POST /auth/register` | `{ "name": "Ahmed Ali", "email": "ahmed@example.com", "password": "password123" }` | نجاح `201` ويرجع `data.user`، ثم اعرض نموذج OTP. لا تسجل الدخول تلقائيًا. |
| تأكيد البريد | `POST /auth/verify-email` | `{ "email": "ahmed@example.com", "code": "123456" }` | نجاح يرجع `data.user`. بعد التأكيد يذهب المستخدم إلى Login حسب الفلو المتفق عليه. |
| إعادة إرسال OTP | `POST /auth/resend-otp` | `{ "email": "ahmed@example.com" }` | اعرض رسالة عامة؛ الرد لا يكشف هل البريد موجود أم لا. |
| تسجيل الدخول | `POST /auth/login` | `{ "email": "ahmed@example.com", "password": "password123" }` | نجاح يضع Cookie الجلسة ويرجع `data.user`. |
| المستخدم الحالي | `GET /auth/me` | بدون Body | عند بدء الموقع افحص الجلسة لتحديث Navbar وحالة المستخدم. |
| تسجيل الخروج | `POST /auth/logout` | بدون Body، مع CSRF | يمسح Cookies؛ بعدها حدّث Navbar وحالة المستخدم. |

`data.user` يحتوي `id`, `name`, `email`, `role`, `emailVerified`, `createdAt`. استخدم الاسم والحرف الأول في Navbar، والدور لتحديد واجهة الإدارة فقط؛ صلاحيات الإدارة تظل محمية في الباك.

> Login لا يقبل حسابًا غير مؤكد، والـ Favorites والـ Bookings والـ Reviews الخاصة تتطلب حسابًا مسجلًا ومؤكد البريد.

### Home وExplore وRestaurant Details

| الصفحة/العملية | الطلب | الاستخدام |
| --- | --- | --- |
| Home: أول 3 أماكن | `GET /restaurants?page=1&pageSize=3&sort=rating` | استخدم أول 3 نتائج. لا يوجد حاليًا مسار مستقل باسم Featured. |
| Explore: القائمة والبحث والفلاتر والترتيب | `GET /restaurants?q=&type=&location=&minRating=&category=&sort=&page=1&pageSize=6` | أرسل القيم المستخدمة فقط. أعد `page` إلى 1 عند تغيير البحث أو أي فلتر أو ترتيب. أرسل كل الفلاتر مجددًا مع كل تغيير صفحة. |
| تفاصيل المكان | `GET /restaurants/{restaurantId}` | `data.restaurant` يحتوي بيانات المطعم والمنيو والمعرض وبيانات التقييم. |
| تقييمات المكان | `GET /restaurants/{restaurantId}/reviews?page=1&pageSize=6` | عام ولا يحتاج تسجيل دخول. استخدم Metadata الصفحات لعرض Pagination. |
| إضافة للمفضلة | `POST /favorites` | يتطلب Login وبريدًا مؤكدًا وCSRF. Body: `{ "restaurantId": 12 }`. |
| إزالة من المفضلة | `DELETE /favorites/{restaurantId}` | يتطلب Login وبريدًا مؤكدًا وCSRF. |
| إنشاء حجز | `POST /bookings` | يتطلب Login وبريدًا مؤكدًا وCSRF. Body موضح أدناه. |
| كتابة Review | `POST /restaurants/{restaurantId}/reviews` | يتطلب Login وبريدًا مؤكدًا وCSRF، ووجود حجز مؤكد سابق للمكان. |

فلاتر Explore المتاحة: `q` نص البحث، `type` بقيمة `restaurant` أو `cafe`، `location`، `minRating` من 0 إلى 5، `category` من القيم المدعومة (`fine-dining`, `casual-dining`, `cafes`, `coffee`, `brunch`)، و`sort` بقيمة `rating` أو `highest` أو `lowest` أو `reviews`. حجم الصفحة الافتراضي 6 والحد الأقصى 50.

قائمة المطاعم ترجع `data.items` و`page`, `pageSize`, `totalItems`, `totalPages`. استخدم `totalPages` للأزرار؛ قد تكون `0` عند عدم وجود نتائج. الفلترة والترتيب تتم في الباك، والفرونت يرسل الاستعلام الحالي عند طلب كل صفحة.

بيانات المطعم المستخدمة في الكروت تشمل `id`, `name`, `type`, `cuisine`, `location`, `price`, `rating`, `reviewCount`, `image`, `imageAlt`, `tags`, `availability`. التفاصيل تضيف `description`, `address`, `hours`, `gallery`, `menu`. قيمة `image` مسار صورة؛ الصور الحالية موجودة في أصول الفرونت ويجب أن تظل المسارات متوافقة معها.

### الحجوزات

| العملية | الطلب | الاستخدام |
| --- | --- | --- |
| عرض حجوزاتي | `GET /bookings` | يعرض الحجوزات المؤكدة القادمة والسابقة للمستخدم الحالي. الحجوزات الملغاة لا تظهر. |
| إنشاء حجز | `POST /bookings` | Body: `{ "restaurantId": 12, "date": "2027-04-20", "time": "19:30", "guests": 2, "specialRequests": "Window seat" }`. |
| إلغاء حجز | `DELETE /bookings/{bookingId}` | يحذف الحجز من العرض بعد النجاح؛ الباك يحتفظ بحالته الملغاة ويمنع الإلغاء بعد وقت الموعد. |

التاريخ `YYYY-MM-DD`، الوقت `HH:MM` بصيغة 24 ساعة، عدد الضيوف من 1 إلى 10، والموعد يجب أن يكون في المستقبل بتوقيت القاهرة. رد الحجز يحتوي `id`, `restaurantId`, بيانات المطعم، `date`, `time`, `guests`, `specialRequests`, `status`.

**ملاحظة Pagination:** مسار الحجوزات الحالي يرجع القائمة كاملة ولا يدعم pagination بعد. لو حجم بيانات الحجوزات كبر، نضيف له Pagination في الباك قبل بناء أرقام الصفحات له.

### المفضلة

| العملية | الطلب | الاستخدام |
| --- | --- | --- |
| عرض المفضلة | `GET /favorites?page=1&pageSize=6` | يتطلب Login وبريدًا مؤكدًا؛ يعيد الأماكن المحفوظة للمستخدم فقط. |
| إضافة | `POST /favorites` | Body: `{ "restaurantId": 12 }`. التكرار آمن ويرجع نجاحًا دون إضافة نسخة ثانية. |
| إزالة | `DELETE /favorites/{restaurantId}` | حدّث الكارت أو أعد تحميل الصفحة الحالية بعد النجاح. |

`GET` يرجع `data.items` ببيانات المكان و`favoriteCreatedAt`، مع Metadata Pagination مثل المطاعم. أعد تحميل الصفحة الحالية بعد الحذف، أو الصفحة السابقة إذا أصبحت الصفحة الحالية فارغة.

### Reviews وMy Reviews

| العملية | الطلب | الاستخدام |
| --- | --- | --- |
| إضافة Review | `POST /restaurants/{restaurantId}/reviews` | Body: `{ "rating": 5, "comment": "Great food." }`. التعليق اختياري وبحد أقصى 500 حرف؛ تقييم واحد لكل مستخدم لكل مطعم. |
| عرض تقييماتي | `GET /reviews/mine?page=1&pageSize=6` | يتطلب Login وبريدًا مؤكدًا. |
| تعديل Review | `PUT /reviews/{reviewId}` | Body يحتوي `rating` و/أو `comment` فقط. المالك وحده يقدر يعدل. |
| حذف Review | `DELETE /reviews/{reviewId}` | المالك وحده يقدر يحذف. |

قوائم Reviews ترجع `data.items` مع Pagination. كائن Review يشمل `id`, `restaurantId`, `restaurantName`, `restaurant`, `rating`, `comment`, `date`, `updatedAt`, `author`. بعد الإضافة أو التعديل أو الحذف حدّث قائمة Reviews وملخص التقييم للمطعم بإعادة جلب بيانات التفاصيل وقائمة Reviews؛ الباك هو من يحسب المتوسط والعدد.

## 5. Pagination والفلاتر

القوائم التي تدعم Pagination حاليًا هي Restaurants وFavorites وReviews العامة وMy Reviews. صيغة الاستجابة:

```json
{
  "items": [],
  "page": 1,
  "pageSize": 6,
  "totalItems": 0,
  "totalPages": 0
}
```

لا تنزل كل النتائج ثم تعمل pagination داخل المتصفح. خزّن قيم الفلاتر الحالية في حالة صفحة Explore، وابنِ URL query parameters من هذه الحالة عند تغيير الصفحة. عمليات إضافة/حذف/تعديل البيانات تستدعي الـ API، بينما التبديل بين الصفحات يرسل طلب GET بالصفحة والفلاتر المطلوبة.

## 6. توزيع الربط داخل الفرونت

1. حدّث `src/js/services/api-client.js` لإرسال `credentials: 'include'`، وإضافة CSRF header في الطلبات المحمية، واستخراج `success/message/data` وأخطاء HTTP بطريقة موحدة.
2. أضف/حدّث Services مستقلة: Auth، Restaurants، Bookings، Favorites، Reviews. الصفحات تستدعي Services فقط ولا تستخدم `fetch` أو Local Storage مباشرة لبيانات الباك.
3. اربط Login وRegister وOTP ثم حالة الجلسة والـ Navbar وLogout.
4. اربط Explore وHome وRestaurant Details باستخدام DB IDs. تأكد أن روابط الكروت تستخدم `restaurant-details.html?id={id}` (أو المسار المتفق عليه) وأن صفحة التفاصيل تقرأ رقم `id` من الرابط.
5. اربط الحجز والمفضلة والتقييمات، ثم صفحات My Bookings وMy Favorites وMy Reviews.
6. أزل اعتماد Services المرتبطة بالباك على بيانات Local Storage التجريبية بعد استكمال كل صفحة. يمكن الإبقاء على ملفات fixtures للتطوير فقط إذا لم تدخل في تدفق الإنتاج.

لا تنفذ أي تغيير مباشر في HTML أو الصفحات قبل تثبيت شكل البيانات في الـ Services؛ المكونات ينبغي أن تستقبل كائنات API بنفس مفاتيح camelCase الموضحة أعلاه.

## 7. نقاط يجب أخذها في الاعتبار

- حماية صفحات الحساب في الفرونت لتحسين تجربة المستخدم فقط؛ الباك هو المرجع النهائي للصلاحيات.
- لا تعرض زر كتابة Review على أنه متاح قبل فحص الأهلية/رد الباك. لا يوجد حاليًا endpoint منفصل لفحص أهلية التقييم، لذلك يمكن إظهار النموذج للمستخدم المسجل وشرح خطأ `booking_required` عند الإرسال، أو إخفاء الزر اعتمادًا على بيانات الحجوزات المتاحة للواجهة.
- التسجيل يحتاج واجهة OTP؛ نجاح `/register` يعني إرسال الرمز وليس أن الحساب أصبح جاهزًا للدخول.
- لا يوجد Forgot Password أو Google Sign-In في النطاق الحالي.
- إنشاء المطاعم وتعديلها وحذفها عمليات Admin فقط؛ ليست جزءًا من تدفق المستخدم العادي. الـ IDs لا يرسلها الفرونت عند الإنشاء.
- لا توجد Pagination للحجوزات في عقد الباك الحالي، ولا Featured endpoint مستقل للـ Home.

## 8. قائمة مراجعة قبل اعتبار الربط مكتملًا

- تحميل الصفحات العامة بدون Login.
- Login و`/auth/me` وLogout يعملون مع Cookies عبر النطاقين المحليين والمنشورين.
- حساب غير مؤكد لا يصل إلى Features المحمية، ورسالة OTP واضحة.
- Search/filter/sort مع Pagination تعرض العدد الصحيح وتحتفظ بالفلاتر عند الانتقال بين الصفحات.
- فتح تفاصيل المطعم من ID قاعدة البيانات وعرض الصور والمنيو والتقييمات.
- إنشاء وإلغاء حجز، وإخفاء الملغي من My Bookings، وإظهار السابق ضمن القائمة.
- إضافة وإزالة Favorites ثم التحقق أن مستخدمًا لا يرى Favorites مستخدم آخر.
- منع Review بدون حجز، وإنشاء/تعديل/حذف Review، وتحديث متوسط المطعم وعدد التقييمات.
- لا يوجد JWT أو كلمة مرور في Local Storage، وأخطاء API تعرض للمستخدم برسائل واضحة.
