"use client";

import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation } from "@tanstack/react-query";
import { API } from "@/services/api";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { Loader2, Briefcase, CheckCircle2, Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

import { PhoneInput } from "@/components/ui/PhoneInput";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { t } from "i18next";
import { useUIStore } from "@/store/useUIStore";

const schema = yup.object({
    phone: yup.string().required("Telefon raqam kiritilishi shart")
        .test("len", "To'liq raqam kiriting", val => val?.replace(/\D/g, "").length === 12),
    password: yup.string().required("Parol kiritilishi shart"),
});

type FormData = yup.InferType<typeof schema>;

export default function LoginView() {
    const router = useRouter();
    const { login } = useAuthStore();
    const { theme, setTheme } = useUIStore();
    const [mounted, setMounted] = useState(false);

    // Hydration xatoligini oldini olish uchun
    useEffect(() => {
        setMounted(true);
    }, []);

    const { register, handleSubmit, control, formState: { errors } } = useForm<FormData>({
        resolver: yupResolver(schema),
    });

    const { mutate: loginToProfile, isPending } = useMutation({
        mutationFn: (body: FormData) => API.post("auth/login/", { ...body, phone: `+${body.phone}` }),
        onSuccess: (res) => {
            const { user, access_token, refresh_token, message } = res.data;

            // Roli backenddan kelmasa avtomatik "director" qilib o'rnatamiz
            const userWithRole = {
                ...user,
                role: user?.role || "director"
            };

            login(userWithRole, { access_token, refresh_token });

            toast.success(message || t("auth.login_success") || "Tizimga muvaffaqiyatli kirdingiz");
            router.push("/");
        },
        onError: (err: any) => {
            const serverErrors = err?.response?.data;
            if (serverErrors?.non_field_errors && Array.isArray(serverErrors.non_field_errors)) {
                toast.error(serverErrors.non_field_errors[0]);
            } else if (serverErrors && typeof serverErrors === "object") {
                const firstKey = Object.keys(serverErrors)[0];
                const errorValue = serverErrors[firstKey];
                if (Array.isArray(errorValue)) {
                    toast.error(errorValue[0]);
                } else {
                    toast.error(t("auth.login_failed") || "Kirish amalga oshmadi, ma'lumotlarni tekshiring.");
                }
            } else {
                toast.error(err?.message || "Xatolik yuz berdi");
            }
        },
    });

    return (
        <div className="min-h-screen flex bg-white dark:bg-slate-950 transition-colors duration-300 relative">

            {/* LIGHT / DARK MODE TOGGLE BUTTON */}
            {mounted && (
                <button
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    className="absolute top-5 right-5 z-50 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer text-slate-500 dark:text-slate-400 active:scale-95 flex items-center justify-center backdrop-blur-sm shadow-sm"
                    aria-label="Toggle Theme"
                >
                    {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400 animate-fadeIn" /> : <Moon className="w-4 h-4 text-indigo-600 animate-fadeIn" />}
                </button>
            )}

            {/* CHAP TOMON: Brending va Direktor Paneli Info */}
            <div className="hidden lg:flex lg:w-1/2 bg-slate-50 dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 p-12 flex-col justify-between relative overflow-hidden">
                {/* Minimalist Grid Fon */}
                <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]" />
                </div>

                {/* Logo */}
                <div className="flex items-center gap-3 relative z-10">
                    <span className="w-10 h-10 text-white bg-indigo-600 text-base flex justify-center items-center rounded-lg font-bold shrink-0 shadow-md shadow-indigo-500/20">
                        EX
                    </span>
                    <div>
                        <p className="text-xl font-black text-slate-900 dark:text-white leading-none tracking-tight">
                            EDUMRX
                        </p>
                        <p className="text-slate-400 dark:text-slate-500 text-[11px] font-bold mt-1 uppercase tracking-wider">
                            Management Console
                        </p>
                    </div>
                </div>

                {/* Markaziy Kontent */}
                <div className="max-w-md my-auto relative z-10">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400 border border-indigo-100/40 dark:border-indigo-900/40 mb-4">
                        <Briefcase className="w-3.5 h-3.5" />
                        Director Workspace
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                        O'quv Markazi Boshqaruv Tizimi
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-3 leading-relaxed">
                        Filial faoliyati, xodimlar, talabalar oqimi va moliyaviy ko'rsatkichlarni real vaqt rejimida tahlil qiling va strategik qarorlar qabul qiling.
                    </p>

                    {/* Imkoniyatlar ro'yxati */}
                    <div className="mt-8 space-y-3.5">
                        <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                            <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                            <span>Lidlar oqimi va talabalar hisoboti</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                            <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                            <span>Guruhlar, dars jadvallari va xonalar nazorati</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                            <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                            <span>Mentorlar samaradorligi va KPI monitoringi</span>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-xs text-slate-400 dark:text-slate-500 relative z-10">
                    &copy; {new Date().getFullYear()} EduMRX CRM. All rights reserved.
                </div>
            </div>

            {/* O'NG TOMON: Login Formasi */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
                <div className="w-full max-w-100">

                    {/* Mobil ekranlar uchun logotip */}
                    <div className="flex lg:hidden items-center gap-3 mb-8">
                        <span className="w-9 h-9 text-white bg-indigo-600 text-sm flex justify-center items-center rounded-lg font-bold shrink-0">
                            EX
                        </span>
                        <p className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
                            EDUMRX <span className="text-xs font-semibold text-indigo-500">Director</span>
                        </p>
                    </div>

                    {/* Sarlavha */}
                    <div className="mb-6">
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                            {t("auth.welcome") || "Xush kelibsiz"}
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5">
                            Director kabinetiga kirish uchun ma'lumotlarni kiriting.
                        </p>
                    </div>

                    {/* Forma */}
                    <form onSubmit={handleSubmit((data) => loginToProfile(data))} className="space-y-4">
                        <div>
                            <Controller
                                name="phone"
                                control={control}
                                render={({ field }) => (
                                    <PhoneInput
                                        value={field.value || ""}
                                        onChange={field.onChange}
                                        error={errors.phone?.message}
                                    />
                                )}
                            />
                        </div>

                        <div>
                            <PasswordInput
                                register={register("password")}
                                error={errors.password?.message}
                            />
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={isPending}
                                className="w-full h-[42px] bg-indigo-600 text-white rounded-lg font-bold flex items-center justify-center hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-700 transition-all active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer text-sm shadow-md shadow-indigo-500/10"
                            >
                                {isPending ? (
                                    <div className="flex items-center gap-2">
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span>Tekshirilmoqda...</span>
                                    </div>
                                ) : (
                                    t("auth.signin") || "Tizimga kirish"
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-900/50 text-center">
                        <p className="text-xs text-slate-400 dark:text-slate-500">
                            Xavfsiz ulanish. Hisobingiz boshqaruv huquqlari himoyalangan.
                        </p>
                    </div>

                </div>
            </div>

        </div>
    );
}