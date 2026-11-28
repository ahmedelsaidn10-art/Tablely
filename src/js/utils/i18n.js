const LANGUAGE_KEY = 'tablely-language';
const translations = {
  'Home': 'الرئيسية', 'Explore': 'استكشف', 'My Bookings': 'حجوزاتي',
  'My bookings': 'حجوزاتي', 'My Favorites': 'مفضلاتي', 'My favorites': 'مفضلاتي',
  'My Reviews': 'تقييماتي', 'Sign in': 'تسجيل الدخول', 'Sign out': 'تسجيل الخروج',
  'Book a table': 'احجز طاولة', 'Guest account': 'حساب زائر', 'Quick links': 'روابط سريعة',
  'Discover': 'اكتشف', 'Restaurants': 'مطاعم', 'Cafes': 'مقاهي', 'Fine dining': 'مطاعم راقية',
  'A better night out': 'أمسية أجمل', 'Made for good food and good company.': 'لأوقات جميلة وطعام طيب.',
  'Discover memorable restaurants and cafes, then reserve a table in just a few clicks.': 'اكتشف مطاعم ومقاهي مميزة واحجز طاولتك بخطوات بسيطة.',
  'Discover. Reserve. Enjoy.': 'اكتشف. احجز. استمتع.', 'Explore places': 'استكشف الأماكن',
  'Home': 'الرئيسية', 'Tablely home': 'الرئيسية - تيبلي',
  'Explore Restaurants & Cafes | Tablely': 'استكشف المطاعم والمقاهي | تيبلي',
  'Restaurant Details | Tablely': 'تفاصيل المكان | تيبلي', 'Sign In | Tablely': 'تسجيل الدخول | تيبلي',
  'Create Your Account | Tablely': 'إنشاء حساب | تيبلي', 'My Bookings | Tablely': 'حجوزاتي | تيبلي',
  'My Favorites | Tablely': 'مفضلاتي | تيبلي', 'My Reviews | Tablely': 'تقييماتي | تيبلي',
  'Verify Your Email | Tablely': 'تأكيد بريدك الإلكتروني | تيبلي',
  'Explore memorable restaurants and artisan cafes, then reserve a table in seconds with zero booking fees.': 'اكتشف مطاعم مميزة ومقاهي رائعة، واحجز طاولتك خلال ثوانٍ بلا رسوم حجز.',
  'Discover your next': 'اكتشف وجهتك القادمة', 'favorite': 'المفضلة', 'dining spot.': 'لتجربة طعام مميزة.',
  '1,200+ curated spots': 'أكثر من ١٢٠٠ مكان مختار',
  'Explore memorable restaurants and artisan cafes, then reserve a table in seconds with zero booking fees.': 'اكتشف مطاعم ومقاهي مميزة واحجز طاولتك خلال ثوانٍ بلا رسوم حجز.',
  'What are you craving?': 'ما الذي تشتهيه؟', 'Location': 'الموقع', 'Explore by category': 'استكشف حسب الفئة',
  'From a morning coffee to a celebratory dinner, find the right place for the moment.': 'من قهوة الصباح إلى عشاء احتفالي، اعثر على المكان المناسب لكل مناسبة.',
  'View all places': 'عرض كل الأماكن', 'Curated selection': 'اختيارات مميزة', 'Featured places': 'أماكن مختارة',
  'Handpicked restaurants and cafes worth experiencing.': 'مطاعم ومقاهٍ مختارة تستحق التجربة.',
  'Your table, made simple': 'حجز طاولتك صار أسهل', 'A better night out in three steps': 'أمسية أجمل في ثلاث خطوات',
  'Spend less time planning and more time enjoying the people around the table.': 'اقضِ وقتًا أقل في التخطيط ووقتًا أكثر مع من تحب.',
  'Choose': 'اختر', 'Compare the details, atmosphere, and availability that matter to you.': 'قارن التفاصيل والأجواء والمواعيد التي تناسبك.',
  'Reserve': 'احجز', 'Book your table in a few simple steps, with no booking fees.': 'احجز طاولتك بخطوات بسيطة ومن دون رسوم حجز.',
  'Good food starts with a good plan': 'الوجبة الجميلة تبدأ بخطة جميلة',
  'dining spot.': 'لتجربة طعام مميزة.', 'Discover your next favorite': 'اكتشف مكانك المفضل القادم',
  'Your next favorite table is waiting.': 'طاولتك المفضلة القادمة بانتظارك.',
  'Find somewhere new to love, and make the reservation in moments.': 'اكتشف مكانًا جديدًا تحبه واحجزه في لحظات.',
  'No booking fees': 'بلا رسوم حجز', 'Instant confirmation': 'تأكيد فوري', 'Curated for you': 'مختارة لك',
  'Find open tables': 'اعثر على طاولات متاحة', 'Find your new favorite': 'اعثر على مكانك المفضل الجديد',
  'Make it a special night': 'اجعلها أمسية مميزة', 'Quick and delicious': 'سريع وشهي', 'Good food, easy plans': 'طعام طيب وخطط سهلة',
  'Rooftops': 'أماكن على الأسطح', 'Specialty espresso': 'إسبريسو مختص', 'Michelin Guide': 'دليل ميشلان',
  'Date night': 'أمسية رومانسية', 'Brunch': 'برانش',
  'Curated gastronomy': 'تجارب طعام مختارة', 'Restaurants & Cafes': 'المطاعم والمقاهي',
  'Discover new places, compare dining experiences, and find the right spot for your next visit.': 'اكتشف أماكن جديدة، وقارن تجارب الطعام، واختر المكان المناسب لزيارتك القادمة.',
  'Search places': 'ابحث عن أماكن', 'Search': 'بحث', 'Search places': 'ابحث عن أماكن', 'Place type': 'نوع المكان',
  'All places': 'كل الأماكن', 'Cafes': 'مقاهٍ', 'Minimum rating': 'أقل تقييم', 'All ratings': 'كل التقييمات',
  '4+ stars': '٤ نجوم فأكثر', '3+ stars': '٣ نجوم فأكثر', '2+ stars': 'نجمتان فأكثر',
  'Clear all': 'مسح الكل', 'Apply filters': 'تطبيق الفلاتر', 'Places': 'الأماكن', 'Sort by': 'ترتيب حسب',
  'Highest rated': 'الأعلى تقييمًا', 'Lowest rated': 'الأقل تقييمًا', 'Most reviewed': 'الأكثر مراجعات',
  'No places found': 'لم نعثر على أماكن', 'Try a different search or clear your filters to see all available places.': 'جرّب بحثًا آخر أو امسح الفلاتر لعرض كل الأماكن المتاحة.',
  'Clear search and filters': 'مسح البحث والفلاتر', 'Place saved.': 'تمت إضافة المكان للمفضلة.',
  'Search by name, cuisine, or location...': 'ابحث بالاسم أو نوع المطبخ أو الموقع...', 'Any location': 'أي موقع',
  'Search and filter places': 'ابحث عن الأماكن وصفّها', 'Explore results controls': 'أدوات نتائج الاستكشاف',
  'Restaurants and cafes': 'المطاعم والمقاهي', 'Explore pages': 'صفحات الاستكشاف',
  'Guest & diner access': 'دخول الزوار والعملاء', 'Welcome back!': 'مرحبًا بعودتك!',
  'Sign in to manage your reservations, revisit your favorite places, and share your dining experiences.': 'سجّل الدخول لإدارة حجوزاتك والعودة إلى أماكنك المفضلة ومشاركة تجاربك.',
  'Email address': 'البريد الإلكتروني', 'Password': 'كلمة المرور', 'Sign in': 'تسجيل الدخول',
  'Send OTP to an existing account': 'أرسل رمز التحقق إلى حساب موجود', "Don't have an account?": 'ليس لديك حساب؟',
  'Create account': 'إنشاء حساب', 'Curated dining': 'تجارب طعام مختارة', 'Make room for a memorable meal.': 'استعد لوجبة لا تُنسى.',
  'Find a place worth gathering around, then reserve your table in a few simple steps.': 'اعثر على مكان يجمع الأحبة، ثم احجز طاولتك بخطوات بسيطة.',
  'Enter your email address': 'أدخل بريدك الإلكتروني', 'Enter your password': 'أدخل كلمة المرور',
  'Show password': 'إظهار كلمة المرور', 'Hide password': 'إخفاء كلمة المرور',
  'Join Tablely today': 'انضم إلى تيبلي اليوم', 'Create your account': 'أنشئ حسابك',
  'Discover memorable restaurants, save places you love, and keep your reservations together.': 'اكتشف مطاعم مميزة، واحفظ أماكنك المفضلة، واجمع حجوزاتك في مكان واحد.',
  'Full name': 'الاسم الكامل', 'Use at least 8 characters.': 'استخدم ٨ أحرف على الأقل.', 'Confirm password': 'تأكيد كلمة المرور',
  "I agree to Tablely's Terms & Conditions and Privacy Policy.": 'أوافق على شروط وأحكام تيبلي وسياسة الخصوصية.',
  'Already have an account?': 'لديك حساب بالفعل؟', 'Good meals are better shared.': 'الوجبات الجميلة تحلو بمشاركتها.',
  'Find welcoming restaurants and cafes, reserve a table, and keep your plans in one place.': 'اكتشف مطاعم ومقاهي ترحب بك، واحجز طاولتك واجمع خططك في مكان واحد.',
  'Enter your full name': 'أدخل اسمك الكامل', 'name@example.com': 'name@example.com', 'Create a password': 'أنشئ كلمة مرور', 'Re-enter your password': 'أعد إدخال كلمة المرور',
  'One last step': 'خطوة أخيرة', 'Verify your email': 'أكّد بريدك الإلكتروني', 'Enter the six-digit code sent to': 'أدخل الرمز المكوّن من ستة أرقام المرسل إلى',
  'your email address': 'بريدك الإلكتروني', 'Verification code': 'رمز التحقق', 'Verify email': 'تأكيد البريد الإلكتروني',
  'Resend code': 'إعادة إرسال الرمز', 'Use a different email': 'استخدم بريدًا إلكترونيًا آخر',
  'Enter the six-digit code sent to your inbox. If it does not arrive, check your spam folder or request a new code.': 'أدخل الرمز المكوّن من ستة أرقام المرسل إلى بريدك. إذا لم يصلك، تحقق من الرسائل غير المرغوب فيها أو اطلب رمزًا جديدًا.',
  'Your Tablely account': 'حسابك في تيبلي', 'A little closer to your next great meal.': 'اقتربت من وجبتك الرائعة القادمة.',
  'Verify your address to keep your reservations, favorites, and reviews together.': 'أكّد بريدك لتحتفظ بحجوزاتك ومفضلاتك وتقييماتك معًا.',
  'Your table plans': 'خطط طاولاتك', 'Keep your reservations organized and ready for your next great meal.': 'نظّم حجوزاتك واستعد لوجبتك الرائعة القادمة.',
  'Find a table': 'اعثر على طاولة', 'Total reservations': 'إجمالي الحجوزات', 'Upcoming and past bookings': 'الحجوزات القادمة والسابقة',
  'Upcoming reservations': 'الحجوزات القادمة', 'Tables waiting for you': 'طاولات بانتظارك', 'Next reservation': 'الحجز القادم',
  'No upcoming reservation': 'لا توجد حجوزات قادمة', 'Your next table will appear here': 'سيظهر حجزك القادم هنا',
  'All': 'الكل', 'Upcoming': 'القادمة', 'No bookings yet': 'لا توجد حجوزات بعد',
  'No upcoming bookings': 'لا توجد حجوزات قادمة', 'Find a place you love and reserve your next table in a few simple steps.': 'اعثر على مكان تحبه واحجز طاولتك القادمة بخطوات بسيطة.',
  'Your past reservations are still available under All.': 'حجوزاتك السابقة متاحة ضمن «الكل».',
  'Cancel your reservation?': 'هل تريد إلغاء حجزك؟', 'on': 'في', 'It will be removed from your bookings.': 'سيُحذف من قائمة حجوزاتك.',
  'Keep booking': 'الاحتفاظ بالحجز', 'Cancel reservation': 'إلغاء الحجز', 'Filter bookings': 'تصفية الحجوزات',
  'Your personal collection': 'مجموعتك الخاصة', 'All the restaurants and cafes you saved, together in one place.': 'كل المطاعم والمقاهي التي حفظتها في مكان واحد.',
  'Share': 'مشاركة', 'Restaurants': 'مطاعم', 'Cafes': 'مقاهٍ', 'Your favorites list is empty': 'قائمة مفضلاتك فارغة',
  'Save places you love and they will show up here for later.': 'احفظ الأماكن التي تحبها لتجدها هنا لاحقًا.',
  'Place removed from favorites.': 'تمت إزالة المكان من المفضلة.', 'Filter favorites by place type': 'تصفية المفضلة حسب نوع المكان',
  'Favorite pages': 'صفحات المفضلة', 'No cafes on this page': 'لا توجد مقاهٍ في هذه الصفحة', 'No restaurants on this page': 'لا توجد مطاعم في هذه الصفحة',
  'Try the other favorite pages or change the filter.': 'جرّب صفحات المفضلة الأخرى أو غيّر الفلتر.',
  'Dining experiences & feedback': 'تجارب الطعام والآراء', 'Your dining experiences matter. Manage your reviews and share feedback about places you have visited.': 'تجاربك تهمنا. أدر تقييماتك وشارك رأيك في الأماكن التي زرتها.',
  'Verified diner': 'عميل موثّق', 'Reviews follow your bookings': 'التقييمات متاحة بعد الحجز', 'Total reviews': 'إجمالي التقييمات',
  'Reviews you have written': 'التقييمات التي كتبتها', 'Average rating': 'متوسط التقييم', 'out of 5': 'من ٥', 'Average on this page': 'المتوسط في هذه الصفحة',
  'Places reviewed': 'أماكن قيّمتها', 'On this page': 'في هذه الصفحة', 'All Reviews': 'كل التقييمات',
  'Sorted by most recent': 'مرتبة من الأحدث', 'You have not written any reviews yet': 'لم تكتب أي تقييم بعد',
  'After you book a place, share your experience from its details page and your review will appear here.': 'بعد حجز مكان، شارك تجربتك من صفحة تفاصيله وسيظهر تقييمك هنا.',
  'Review updated.': 'تم تحديث التقييم.', 'Update your experience': 'عدّل تجربتك', 'Edit review': 'تعديل التقييم',
  'Your rating': 'تقييمك', 'Choose a rating from 1 to 5.': 'اختر تقييمًا من ١ إلى ٥.', 'Your review': 'مراجعتك',
  '(optional)': '(اختياري)', 'Cancel': 'إلغاء', 'Save changes': 'حفظ التعديلات', 'Delete this review?': 'هل تريد حذف هذا التقييم؟',
  'This review will be removed from your list. You can write a new one from the restaurant details page.': 'سيُحذف هذا التقييم من قائمتك. يمكنك كتابة تقييم جديد من صفحة تفاصيل المطعم.',
  'Keep review': 'الاحتفاظ بالتقييم', 'Delete review': 'حذف التقييم', 'Filter reviews by place type': 'تصفية التقييمات حسب نوع المكان',
  'My review pages': 'صفحات تقييماتي', 'Close edit review': 'إغلاق تعديل التقييم', 'Choose a rating from one to five stars': 'اختر تقييمًا من نجمة إلى خمس نجوم',
  '1 star': 'نجمة واحدة', '2 stars': 'نجمتان', '3 stars': '٣ نجوم', '4 stars': '٤ نجوم', '5 stars': '٥ نجوم',
  'Share what you enjoyed about the place...': 'شاركنا ما أعجبك في المكان...', 'Could not save your changes.': 'تعذر حفظ التعديلات.',
  'Could not delete the review. Please try again.': 'تعذر حذف التقييم. حاول مرة أخرى.', 'Could not load reviews.': 'تعذر تحميل التقييمات.',
  'Home': 'الرئيسية', 'Restaurant': 'مطعم', 'Loading location': 'جارٍ تحميل الموقع', 'Loading restaurant…': 'جارٍ تحميل المكان…',
  'Reserve a table': 'احجز طاولة', 'reviews': 'تقييمات', 'review': 'تقييم', 'About this place': 'عن هذا المكان',
  'Made for the moment': 'أجواء تناسب مناسبتك', 'Menu highlights': 'أبرز أطباق القائمة', 'A few guest favorites': 'بعض الأطباق المفضلة لدى الضيوف',
  'From our guests': 'من ضيوفنا', 'Reviews & Ratings': 'التقييمات والآراء', 'average from': 'متوسط', 'ratings': 'تقييمات',
  'Write a Review': 'اكتب تقييمًا', 'Reserve your table': 'احجز طاولتك', 'Date': 'التاريخ', 'Guests': 'الضيوف',
  'Available times': 'المواعيد المتاحة', 'Special requests': 'طلبات خاصة', 'Confirm reservation': 'تأكيد الحجز',
  'Instant confirmation · Free reservation': 'تأكيد فوري · الحجز مجاني', 'Write Your Review': 'اكتب تقييمك',
  'Choose a star rating before submitting.': 'اختر عدد النجوم قبل الإرسال.', 'Submit Review': 'إرسال التقييم',
  'Reservation Confirmed!': 'تم تأكيد الحجز!', 'Done': 'تم', 'Anything we should know?': 'هل لديك طلبات خاصة؟',
  'Close review form': 'إغلاق نموذج التقييم', 'Share what you enjoyed about your visit.': 'شاركنا ما أعجبك في زيارتك.',
  'You need to book this restaurant before you can write a review.': 'يجب حجز هذا المطعم قبل كتابة تقييم.',
  'Could not check your booking.': 'تعذر التحقق من حجزك.', 'Could not load restaurant': 'تعذر تحميل بيانات المكان',
  'Restaurant not found': 'لم نعثر على المطعم', 'This place could not be found. Explore our restaurants and cafes to choose another one.': 'لم نعثر على هذا المكان. استكشف المطاعم والمقاهي واختر مكانًا آخر.',
  'Could not save your reservation. Please try again.': 'تعذر حفظ حجزك. حاول مرة أخرى.', 'Could not save your review. Please try again.': 'تعذر حفظ تقييمك. حاول مرة أخرى.',
  'Loading reviews...': 'جارٍ تحميل التقييمات...', 'Could not load places': 'تعذر تحميل الأماكن', 'Places unavailable': 'الأماكن غير متاحة',
  'Check your connection and try again.': 'تحقق من اتصالك وحاول مرة أخرى.', 'Could not load places.': 'تعذر تحميل الأماكن.',
  'Could not load bookings.': 'تعذر تحميل الحجوزات.', 'Could not load favorites.': 'تعذر تحميل المفضلة.',
  'Could not update favorites.': 'تعذر تحديث المفضلة.', 'Could not update favorites. Please try again.': 'تعذر تحديث المفضلة. حاول مرة أخرى.',
  'Could not cancel this reservation. Please try again.': 'تعذر إلغاء هذا الحجز. حاول مرة أخرى.',
  'Could not send OTP': 'تعذر إرسال رمز التحقق', 'Please try again.': 'حاول مرة أخرى.',
  'OTP request sent': 'تم إرسال طلب رمز التحقق', 'If the account needs verification, a new code will be sent.': 'إذا كان الحساب بحاجة إلى تأكيد، فسيُرسل رمز جديد.',
  'Sending OTP...': 'جارٍ إرسال رمز التحقق...', 'Signing in...': 'جارٍ تسجيل الدخول...', 'Creating account...': 'جارٍ إنشاء الحساب...',
  'Verify your email first': 'أكّد بريدك الإلكتروني أولًا', 'Enter the verification code sent to your email.': 'أدخل رمز التحقق المرسل إلى بريدك الإلكتروني.',
  'Check your email and password, then try again.': 'تحقق من بريدك الإلكتروني وكلمة المرور، ثم حاول مرة أخرى.',
  'Create account': 'إنشاء حساب', 'Could not send OTP': 'تعذر إرسال رمز التحقق',
  'Could not verify email': 'تعذر تأكيد البريد الإلكتروني', 'Enter the six-digit code.': 'أدخل الرمز المكوّن من ستة أرقام.',
  'Check the code and try again.': 'تحقق من الرمز وحاول مرة أخرى.', 'Wait a moment and try again.': 'انتظر قليلًا ثم حاول مرة أخرى.',
  'Could not connect to the server.': 'تعذر الاتصال بالخادم.', 'Could not connect to the backend.': 'تعذر الاتصال بالخادم.',
  'Sign in to continue.': 'سجّل الدخول للمتابعة.', 'Your session has expired. Sign in again.': 'انتهت جلستك. سجّل الدخول مجددًا.',
  'The sign-in token is invalid.': 'رمز تسجيل الدخول غير صالح.', 'The request could not be completed.': 'تعذر إكمال الطلب.',
  'The request could not be verified.': 'تعذر التحقق من الطلب.', 'Email or password is incorrect.': 'البريد الإلكتروني أو كلمة المرور غير صحيحة.',
  'Email is already registered.': 'هذا البريد الإلكتروني مسجل بالفعل.', 'This email is already registered.': 'هذا البريد الإلكتروني مسجل بالفعل.',
  'Invalid verification code.': 'رمز التحقق غير صالح.', 'Email verified successfully.': 'تم تأكيد البريد الإلكتروني بنجاح.',
  'Please check your details and try again.': 'تحقق من البيانات وحاول مرة أخرى.',
  'The password must be at least 8 characters.': 'يجب ألا تقل كلمة المرور عن ٨ أحرف.',
  'Passwords do not match.': 'كلمتا المرور غير متطابقتين.', 'Enter a valid email address.': 'أدخل بريدًا إلكترونيًا صالحًا.',
  'View details': 'عرض التفاصيل', 'View restaurant': 'عرض المطعم', 'Reservation': 'حجز', 'Upcoming': 'القادمة',
  'Completed': 'مكتمل', 'Cancelled': 'ملغي', 'Time': 'الوقت', 'Note:': 'ملاحظة:', 'Ref.': 'رقم الحجز:',
  'Add to favorites': 'أضف إلى المفضلة', 'Remove from favorites': 'أزل من المفضلة', 'Add to': 'أضف إلى', 'Remove from': 'أزل من',
  'Switch theme': 'تبديل المظهر', 'Switch to dark theme': 'التبديل إلى المظهر الداكن', 'Switch to light theme': 'التبديل إلى المظهر الفاتح',
  'Open menu': 'فتح القائمة', 'Close menu': 'إغلاق القائمة', 'Main navigation': 'التنقل الرئيسي', 'Mobile navigation': 'تنقل الهاتف',
  'Breadcrumb': 'مسار التنقل', 'Restaurant photos': 'صور المطعم', 'Filter menu items': 'تصفية أطباق القائمة', 'Review pages': 'صفحات التقييمات',
  'Loading places...': 'جارٍ تحميل الأماكن...', 'No results': 'لا توجد نتائج',
  'Tablely — Discover. Reserve. Enjoy.': 'تيبلي — اكتشف. احجز. استمتع.',
  'A table worth sharing': 'طاولة تجمع الأحبة', 'Atmospheres & dining': 'أجواء وتجارب طعام',
  'Explore a thoughtfully picked collection of restaurants and cafes.': 'استكشف مجموعة مختارة بعناية من المطاعم والمقاهي.',
  'Book your table in a few simple steps, with no booking fees.': 'احجز طاولتك بخطوات بسيطة ومن دون رسوم حجز.',
  'Compare the details, atmosphere, and availability that matter to you.': 'قارن التفاصيل والأجواء والمواعيد التي تهمك.',
  'Your next great evening': 'أمسيتك الرائعة القادمة', 'Dinner for two · 7:30 PM tonight': 'عشاء لشخصين · ٧:٣٠ مساءً اليوم',
  'L\'Aura Bistro · SoHo': 'مطعم لورا · سوهو', 'Popular:': 'الأكثر رواجًا:', 'from 50k+ diners': 'من أكثر من ٥٠ ألف زائر',
  'Free': 'مجاني', '4.9': '٤٫٩', 'Could not check your sign-in status. Refresh the page or try again later.': 'تعذر التحقق من تسجيل دخولك. حدّث الصفحة أو حاول مرة أخرى لاحقًا.',
  'Are you sure you want to cancel your booking at': 'هل أنت متأكد أنك تريد إلغاء حجزك في',
  'this restaurant': 'هذا المطعم', 'the selected time': 'الوقت المحدد', 'bookings': 'حجوزات',
  'Enter your email address.': 'أدخل بريدك الإلكتروني.', 'Enter a valid email address.': 'أدخل بريدًا إلكترونيًا صالحًا.',
  'Enter your password.': 'أدخل كلمة المرور.', 'Enter your full name.': 'أدخل اسمك الكامل.',
  'Your name must contain at least 2 characters.': 'يجب ألا يقل اسمك عن حرفين.', 'Create a password.': 'أنشئ كلمة مرور.',
  'Confirm your password.': 'أكّد كلمة المرور.', 'Please accept the terms to create an account.': 'يرجى الموافقة على الشروط لإنشاء الحساب.',
  'Enter your account email first.': 'أدخل بريد حسابك أولًا.', 'Please check your connection and try again.': 'تحقق من اتصالك وحاول مرة أخرى.',
  'Unable to sign in': 'تعذر تسجيل الدخول', 'Something went wrong. Please try again.': 'حدث خطأ ما. حاول مرة أخرى.',
  'Welcome back, diner!': 'مرحبًا بعودتك!', 'You are signed in. Taking you back to Tablely...': 'تم تسجيل دخولك. جارٍ إعادتك إلى تيبلي...',
  'Email already registered': 'البريد الإلكتروني مسجل بالفعل', 'Could not create account': 'تعذر إنشاء الحساب',
  'Verification code sent': 'تم إرسال رمز التحقق', 'Continue to email verification to finish setting up your account.': 'أكمل تأكيد البريد الإلكتروني لإتمام إعداد حسابك.',
  'Email address is missing': 'البريد الإلكتروني غير موجود', 'Go back to registration and submit your email address.': 'ارجع إلى التسجيل وأدخل بريدك الإلكتروني.',
  'Email verified': 'تم تأكيد البريد الإلكتروني', 'Taking you to sign in...': 'جارٍ نقلك إلى تسجيل الدخول...',
  'Request received': 'تم استلام الطلب', 'Could not resend code': 'تعذرت إعادة إرسال الرمز',
  'Could not cancel this reservation. Please try again.': 'تعذر إلغاء هذا الحجز. حاول مرة أخرى.',
  'Could not update favorites.': 'تعذر تحديث المفضلة.', 'No cafes on this page': 'لا توجد مقاهٍ في هذه الصفحة',
  'No restaurants on this page': 'لا توجد مطاعم في هذه الصفحة', 'Could not load bookings.': 'تعذر تحميل الحجوزات.',
  'Could not load favorites.': 'تعذر تحميل المفضلة.', 'Could not load reviews.': 'تعذر تحميل التقييمات.',
  'Could not load places.': 'تعذر تحميل الأماكن.', 'Could not load restaurant': 'تعذر تحميل بيانات المكان',
  'Could not save your reservation. Please try again.': 'تعذر حفظ حجزك. حاول مرة أخرى.',
  'Could not save your review. Please try again.': 'تعذر حفظ تقييمك. حاول مرة أخرى.',
  'Could not update favorites. Please try again.': 'تعذر تحديث المفضلة. حاول مرة أخرى.',
  'Could not check your booking.': 'تعذر التحقق من حجزك.',
  'Sign in to continue.': 'سجّل الدخول للمتابعة.', 'Your session has expired. Sign in again.': 'انتهت جلستك. سجّل الدخول مجددًا.',
  'The sign-in token is invalid.': 'رمز تسجيل الدخول غير صالح.', 'The request could not be completed.': 'تعذر إكمال الطلب.',
  'The request could not be verified.': 'تعذر التحقق من الطلب.', 'The backend request failed.': 'تعذر إكمال الطلب.',
  'The backend URL is not configured. Set VITE_API_BASE_URL first.': 'رابط الخادم غير مضبوط. أعد إعداد VITE_API_BASE_URL أولًا.',
  'Tablely — Discover. Reserve. Enjoy.': 'تيبلي — اكتشف. احجز. استمتع.',
  'Tablely â€” Discover. Reserve. Enjoy.': 'تيبلي — اكتشف. احجز. استمتع.',
  'Enter the six-digit code sent to': 'أدخل الرمز المكوّن من ستة أرقام المرسل إلى',
  'Email address is missing': 'البريد الإلكتروني غير موجود',
  'Go back to registration and submit your email address.': 'ارجع إلى التسجيل وأدخل بريدك الإلكتروني.',
  'Could not verify email': 'تعذر تأكيد البريد الإلكتروني', 'Email verified': 'تم تأكيد البريد الإلكتروني',
  'Taking you to sign in...': 'جارٍ نقلك إلى تسجيل الدخول...', 'Request received': 'تم استلام الطلب',
  'Could not resend code': 'تعذرت إعادة إرسال الرمز', 'Unable to sign in': 'تعذر تسجيل الدخول',
  'Something went wrong. Please try again.': 'حدث خطأ ما. حاول مرة أخرى.',
  'Welcome back, diner!': 'مرحبًا بعودتك!',
  'You are signed in. Taking you back to Tablely...': 'تم تسجيل دخولك. جارٍ إعادتك إلى تيبلي...',
  'Email already registered': 'البريد الإلكتروني مسجل بالفعل', 'Verification code sent': 'تم إرسال رمز التحقق',
  'Continue to email verification to finish setting up your account.': 'أكمل تأكيد البريد الإلكتروني لإتمام إعداد حسابك.',
  '2+ stars': 'نجمتان فأكثر', '3+ stars': '٣ نجوم فأكثر',
  'A few guest favorites': 'بعض الأطباق المفضلة لدى الضيوف', 'average from': 'متوسط',
  'The password must be at least 8 characters.': 'يجب ألا تقل كلمة المرور عن ٨ أحرف.',
  'Could not check your sign-in status. Refresh the page or try again later.': 'تعذر التحقق من تسجيل دخولك. حدّث الصفحة أو حاول مرة أخرى لاحقًا.',
  'Inviting modern restaurant dining room with tables ready for guests': 'قاعة مطعم عصرية ترحب بالضيوف وطاولاتها جاهزة.',
  'Warm, plant-filled dining room at The Garden Bistro': 'قاعة طعام دافئة مليئة بالنباتات في ذا جاردن بيسترو.',
  'A welcoming, plant-filled restaurant dining room': 'قاعة مطعم مرحبة ومليئة بالنباتات.',
  'Warm dining room prepared for guests': 'قاعة طعام دافئة جاهزة لاستقبال الضيوف.',
  'Switch language to Arabic': 'حوّل اللغة إلى العربية',
  'Verify your email before using bookings.': 'أكّد بريدك الإلكتروني قبل استخدام الحجوزات.',
  'Verify your email before using favorites.': 'أكّد بريدك الإلكتروني قبل استخدام المفضلة.',
  'Verify your email before using reviews.': 'أكّد بريدك الإلكتروني قبل استخدام التقييمات.',
  'Send a JSON object in the request body.': 'أرسل بيانات الطلب بصيغة JSON.',
  'Restaurant not found.': 'لم نعثر على المطعم.', 'Review not found.': 'لم نعثر على التقييم.',
  'Booking not found.': 'لم نعثر على الحجز.', 'You have already reviewed this restaurant.': 'سبق لك تقييم هذا المطعم.',
  'The booking could not be saved.': 'تعذر حفظ الحجز.', 'The booking could not be cancelled.': 'تعذر إلغاء الحجز.',
  'This booking is already cancelled.': 'تم إلغاء هذا الحجز بالفعل.',
  'Choose a reservation time in the future.': 'اختر موعد حجز في المستقبل.',
  'Guest count must be from 1 to 10.': 'يجب أن يتراوح عدد الضيوف بين ١ و١٠.',
  'Complete the required booking fields.': 'أكمل بيانات الحجز المطلوبة.', 'Check the booking details.': 'تحقق من بيانات الحجز.',
  'The request contains unsupported fields.': 'يحتوي الطلب على حقول غير مدعومة.',
  'Check the review details.': 'تحقق من بيانات التقييم.', 'Choose a rating from 1 to 5.': 'اختر تقييمًا من ١ إلى ٥.',
  'Provide a rating or comment to update.': 'أضف تقييمًا أو تعليقًا لإجراء التحديث.',
  'Check the registration details.': 'تحقق من بيانات التسجيل.', 'An account with this email already exists.': 'يوجد حساب مسجل بهذا البريد الإلكتروني بالفعل.',
  'The verification code is invalid or expired.': 'رمز التحقق غير صالح أو انتهت صلاحيته.',
  'This email is already verified.': 'تم تأكيد هذا البريد الإلكتروني بالفعل.',
  'Request a new verification code.': 'اطلب رمز تحقق جديدًا.', 'Wait before requesting another code.': 'انتظر قبل طلب رمز آخر.',
  'Check your sign-in details.': 'تحقق من بيانات تسجيل الدخول.', 'Check your email and password.': 'تحقق من بريدك الإلكتروني وكلمة المرور.',
  'Verify your email before signing in.': 'أكّد بريدك الإلكتروني قبل تسجيل الدخول.',
  'The account no longer exists.': 'لم يعد هذا الحساب موجودًا.', 'Email delivery is not configured.': 'خدمة إرسال البريد الإلكتروني غير مهيأة.',
  'Check the verification details.': 'تحقق من بيانات التأكيد.', 'Current user loaded.': 'تم تحميل بيانات المستخدم.',
  'Signed out.': 'تم تسجيل الخروج.', 'Email verified.': 'تم تأكيد البريد الإلكتروني.',
  'Check the favorite details.': 'تحقق من بيانات المفضلة.', 'Check the favorites pagination.': 'تحقق من إعدادات صفحات المفضلة.',
  'Check the review pagination.': 'تحقق من إعدادات صفحات التقييمات.', 'The favorite could not be saved.': 'تعذر حفظ المكان في المفضلة.',
  'The review could not be updated.': 'تعذر تحديث التقييم.', 'The review conflicts with an existing record.': 'يتعارض التقييم مع بيانات موجودة.',
  'The booking conflicts with existing data.': 'يتعارض الحجز مع بيانات موجودة.',
  'Favorite data could not be accessed.': 'تعذر الوصول إلى بيانات المفضلة.',
  'Review data could not be accessed.': 'تعذر الوصول إلى بيانات التقييمات.',
  'Booking data could not be accessed.': 'تعذر الوصول إلى بيانات الحجوزات.',
  'Authentication data could not be accessed.': 'تعذر الوصول إلى بيانات تسجيل الدخول.',
  'This email has already been registered.': 'هذا البريد الإلكتروني مسجل بالفعل.',
  'The email address is already in use.': 'البريد الإلكتروني مستخدم بالفعل.',
  'Page': 'صفحة', 'star': 'نجمة', 'stars': 'نجوم',
};

let currentLanguage = 'en';
const textState = new WeakMap();
const attributeState = new WeakMap();
const translatedAttributes = ['aria-label', 'title', 'placeholder', 'alt'];

function translateText(source, language = currentLanguage) {
  if (language !== 'ar') return source;
  const text = String(source);
  const trimmed = text.trim();
  if (!trimmed) return source;
  if (translations[trimmed]) return source.replace(trimmed, translations[trimmed]);

  let match = trimmed.match(/^(\d+) (place|places) found$/i);
  if (match) return source.replace(trimmed, `تم العثور على ${match[1]} مكان`);
  match = trimmed.match(/^(\d+) (booking|bookings)$/i);
  if (match) return source.replace(trimmed, `${match[1]} ${match[1] === '1' ? 'حجز' : 'حجوزات'}`);
  match = trimmed.match(/^(\d+) saved (place|places)$/i);
  if (match) return source.replace(trimmed, `${match[1]} مكان محفوظ`);
  match = trimmed.match(/^Page (\d+)$/i);
  if (match) return source.replace(trimmed, `صفحة ${match[1]}`);
  match = trimmed.match(/^Ref\. (.+)$/i);
  if (match) return source.replace(trimmed, `رقم الحجز: ${match[1]}`);
  match = trimmed.match(/^View (.+) details$/i);
  if (match) return source.replace(trimmed, `عرض تفاصيل ${match[1]}`);
  match = trimmed.match(/^Delete review for (.+)$/i);
  if (match) return source.replace(trimmed, `حذف تقييم ${match[1]}`);
  match = trimmed.match(/^Welcome back, (.+)!$/i);
  if (match) return source.replace(trimmed, `مرحبًا بعودتك، ${match[1]}!`);
  match = trimmed.match(/^(.+) · (.+) at (.+) · (\d+) guests$/i);
  if (match) return source.replace(trimmed, `${match[1]} · ${match[2]} في ${match[3]} · ${match[4]} ضيوف`);
  match = trimmed.match(/^(.+) at (.+)$/i);
  if (match && !/^\d/.test(trimmed)) return source.replace(trimmed, `${match[1]} في ${match[2]}`);
  match = trimmed.match(/^(\d+) out of 5 stars?$/i);
  if (match) return source.replace(trimmed, `${match[1]} من ٥ نجوم`);
  match = trimmed.match(/^(\d+) reviews?$/i);
  if (match) return source.replace(trimmed, `${match[1]} ${match[1] === '1' ? 'تقييم' : 'تقييمات'}`);

  // Format common date strings generated by the browser in Arabic.
  if (/^[A-Za-z]{3,9},? [A-Za-z]{3,9} \d{1,2}, \d{4}$/.test(trimmed)) {
    const date = new Date(trimmed);
    if (!Number.isNaN(date.getTime())) {
      return source.replace(trimmed, new Intl.DateTimeFormat('ar-EG', {
        weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
      }).format(date));
    }
  }
  return source;
}

export function translateUiText(text) {
  return translateText(String(text));
}

function isTranslatable(node) {
  return !node.parentElement?.closest('script, style, .material-symbols-outlined, [data-no-translate]');
}

function translateTextNode(node) {
  if (!isTranslatable(node)) return;
  const current = node.nodeValue;
  const previous = textState.get(node);
  const source = previous && current === previous.rendered ? previous.source : current;
  const rendered = translateText(source);
  textState.set(node, { source, rendered });
  if (current !== rendered) node.nodeValue = rendered;
}

function translateElementAttributes(element) {
  if (element.closest?.('[data-no-translate]')) return;
  translatedAttributes.forEach((name) => {
    if (!element.hasAttribute(name)) return;
    const value = element.getAttribute(name);
    const state = attributeState.get(element) || {};
    const previous = state[name];
    const source = previous && value === previous.rendered ? previous.source : value;
    const rendered = translateText(source);
    state[name] = { source, rendered };
    attributeState.set(element, state);
    if (value !== rendered) element.setAttribute(name, rendered);
  });
}

function translateSubtree(root) {
  if (root.nodeType === Node.TEXT_NODE) {
    translateTextNode(root);
    return;
  }
  if (root.nodeType !== Node.ELEMENT_NODE && root !== document.body) return;
  if (root.nodeType === Node.ELEMENT_NODE) translateElementAttributes(root);
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let node;
  while ((node = walker.nextNode())) translateTextNode(node);
  root.querySelectorAll?.('*').forEach(translateElementAttributes);
  updateDirectionalIcons(root);
}

function updateDirectionalIcons(root) {
  const scope = root.nodeType === Node.TEXT_NODE ? root.parentElement : root;
  if (!scope?.querySelectorAll) return;
  const icons = [];
  if (scope.matches?.('.material-symbols-outlined')) icons.push(scope);
  icons.push(...scope.querySelectorAll('.material-symbols-outlined'));
  icons.forEach((icon) => {
    const isDirectional = ['arrow_forward', 'arrow_back'].includes(icon.textContent.trim());
    icon.classList.toggle('rtl-directional-icon', currentLanguage === 'ar' && isDirectional);
  });
}

function updateLanguageControls(root) {
  const labels = [];
  const buttons = [];
  if (root.matches?.('[data-language-label]')) labels.push(root);
  if (root.matches?.('[data-language-toggle]')) buttons.push(root);
  labels.push(...(root.querySelectorAll?.('[data-language-label]') || []));
  buttons.push(...(root.querySelectorAll?.('[data-language-toggle]') || []));

  labels.forEach((label) => {
    const nextLabel = currentLanguage === 'ar' ? 'English' : '\u0627\u0644\u0639\u0631\u0628\u064a\u0629';
    if (label.textContent !== nextLabel) label.textContent = nextLabel;
  });
  buttons.forEach((button) => {
    const nextLabel = currentLanguage === 'ar' ? '\u062d\u0648\u0651\u0644 \u0627\u0644\u0644\u063a\u0629 \u0625\u0644\u0649 \u0627\u0644\u0625\u0646\u062c\u0644\u064a\u0632\u064a\u0629' : 'Switch language to Arabic';
    const nextTitle = currentLanguage === 'ar' ? 'English' : '\u0627\u0644\u0639\u0631\u0628\u064a\u0629';
    if (button.getAttribute('aria-label') !== nextLabel) button.setAttribute('aria-label', nextLabel);
    if (button.getAttribute('title') !== nextTitle) button.setAttribute('title', nextTitle);
  });
}

function updateDocumentLanguage(language) {
  currentLanguage = language;
  document.documentElement.lang = language;
  document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';

  const titleSource = document.documentElement.dataset.englishTitle || document.title;
  document.documentElement.dataset.englishTitle = titleSource;
  document.title = translateText(titleSource, language);

  updateLanguageControls(document);
  updateDirectionalIcons(document.body);
}
// Apply direction early so a slow authentication request cannot leave the page LTR.
export function applySavedLanguagePreference() {
  try {
    currentLanguage = localStorage.getItem(LANGUAGE_KEY) === 'ar' ? 'ar' : 'en';
  } catch {
    currentLanguage = 'en';
  }
  document.documentElement.lang = currentLanguage;
  document.documentElement.dir = currentLanguage === 'ar' ? 'rtl' : 'ltr';
}

export function initLanguage() {
  applySavedLanguagePreference();
  updateDocumentLanguage(currentLanguage);
  translateSubtree(document.body);

  document.body.addEventListener('click', (event) => {
    if (!event.target.closest('[data-language-toggle]')) return;
    const nextLanguage = currentLanguage === 'ar' ? 'en' : 'ar';
    try { localStorage.setItem(LANGUAGE_KEY, nextLanguage); } catch { /* The language still changes for this page. */ }
    updateDocumentLanguage(nextLanguage);
    translateSubtree(document.body);
  });

  const observer = new MutationObserver((records) => {
    records.forEach((record) => {
      if (record.type === 'characterData') {
        translateTextNode(record.target);
        return;
      }
      if (record.type === 'attributes') {
        translateElementAttributes(record.target);
        return;
      }
      record.addedNodes.forEach((node) => {
        if (node.nodeType !== Node.ELEMENT_NODE && node.nodeType !== Node.TEXT_NODE) return;
        translateSubtree(node);
        updateLanguageControls(node.nodeType === Node.TEXT_NODE ? node.parentElement : node);
      });
    });
  });
  observer.observe(document.body, {
    childList: true,
    characterData: true,
    attributes: true,
    attributeFilter: translatedAttributes,
    subtree: true,
  });
}

