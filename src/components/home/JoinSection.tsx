import { useToast } from "../../context/ToastContext";
import Button from "../ui/Button";

export default function JoinSection() {
  const showToast = useToast();

  return (
    <section className="py-15">
      <div className="mx-auto grid w-[min(calc(100%-40px),1240px)] grid-cols-1 items-center overflow-hidden rounded-[32px] bg-assid-sand md:grid-cols-[1.05fr_.95fr]">
        <div className="p-8 md:p-13.5">
          <div className="inline-flex items-center gap-2 text-[0.74rem] font-extrabold uppercase tracking-[.16em] text-assid-green before:h-0.5 before:w-5 before:bg-assid-lime">
            ASSİD ailesine katılın
          </div>
          <h2 className="my-3.5 text-[clamp(2rem,3.6vw,3.55rem)] leading-[1.02] tracking-[-.055em]">
            Firmanızı doğru iş bağlantılarıyla buluşturun.
          </h2>
          <p className="mb-6 max-w-lg text-[#59635c]">
            Markanızı dijital firma rehberinde görünür kılın, yeni iş birliklerine erişin ve
            sektörünüzdeki gelişmeleri yakından takip edin.
          </p>
          <Button
            variant="primary"
            onClick={() => showToast("Başvuru formu WordPress'te yönetim onay akışıyla çalışacak.")}
          >
            Üyelik Başvurusu <span>→</span>
          </Button>
        </div>
        <div className="min-h-96.5 bg-[linear-gradient(20deg,rgba(9,32,54,.78),rgba(9,32,54,.02)),url('https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=1200&q=85')] bg-cover bg-center" />
      </div>
    </section>
  );
}
