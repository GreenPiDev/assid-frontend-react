import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { changeMyPassword } from "../../api/member";
import { EyeIcon, EyeOffIcon } from "../../components/admin/icons";
import { useToast } from "../../context/ToastContext";

function PasswordField({
  label,
  value,
  onChange,
  minLength,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  minLength?: number;
  placeholder?: string;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <label className="grid gap-1.5">
      <span className="text-[0.78rem] font-bold text-assid-muted">{label}</span>
      <div className="relative">
        <input
          required
          minLength={minLength}
          type={visible ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-[12px] border border-assid-line bg-assid-paper px-3.5 py-2.5 pr-11 outline-none focus:border-assid-green/50"
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Şifreyi gizle" : "Şifreyi göster"}
          className="absolute inset-y-0 right-0 grid w-10 cursor-pointer place-items-center text-assid-muted"
        >
          {visible ? <EyeOffIcon className="h-4.5 w-4.5" /> : <EyeIcon className="h-4.5 w-4.5" />}
        </button>
      </div>
    </label>
  );
}

export default function MemberPasswordPage() {
  const showToast = useToast();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const changePasswordMutation = useMutation({
    mutationFn: ({ current, next }: { current: string; next: string }) => changeMyPassword(current, next),
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showToast("Yeni şifreler eşleşmiyor.");
      return;
    }
    try {
      await changePasswordMutation.mutateAsync({ current: currentPassword, next: newPassword });
      showToast("Şifreniz güncellendi.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Şifre güncellenemedi.");
    }
  }

  return (
    <div>
      <div className="mb-6">
        <span className="text-[0.74rem] font-extrabold uppercase tracking-[.16em] text-assid-green">
          Üye Paneli
        </span>
        <h1 className="mt-1 text-[1.5rem] tracking-[-.03em] text-assid-ink">Şifre Değiştir</h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid max-w-md gap-4 rounded-[20px] border border-assid-line bg-white p-6 md:p-8"
      >
        <PasswordField label="Mevcut Şifre" value={currentPassword} onChange={setCurrentPassword} />
        <PasswordField
          label="Yeni Şifre"
          value={newPassword}
          onChange={setNewPassword}
          minLength={8}
          placeholder="En az 8 karakter"
        />
        <PasswordField
          label="Yeni Şifre (Tekrar)"
          value={confirmPassword}
          onChange={setConfirmPassword}
          minLength={8}
        />
        <div className="mt-2 flex justify-end">
          <button
            type="submit"
            disabled={changePasswordMutation.isPending}
            className="cursor-pointer rounded-full border-0 bg-assid-green px-6 py-3 text-[0.88rem] font-bold text-white disabled:opacity-60"
          >
            {changePasswordMutation.isPending ? "Kaydediliyor..." : "Şifreyi Güncelle"}
          </button>
        </div>
      </form>
    </div>
  );
}
