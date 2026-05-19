import { useNavigate } from "react-router-dom";
import { MessageCircle, Users, ShieldCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <MessageCircle size={22} />
          </div>
          <h1 className="text-2xl font-bold">ChatChit</h1>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={() => navigate("/signin")}>
            Đăng nhập
          </Button>
          <Button onClick={() => navigate("/signup")}>Đăng ký</Button>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-6 py-16 md:grid-cols-2 md:py-24">
        <div>
          <p className="mb-4 inline-flex rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
            Ứng dụng trò chuyện thời gian thực
          </p>

          <h2 className="mb-6 text-4xl font-bold leading-tight md:text-6xl">
            Kết nối, nhắn tin và chia sẻ cùng bạn bè với{" "}
            <span className="text-primary">ChatChit</span>
          </h2>

          <p className="mb-8 max-w-xl text-base leading-7 text-muted-foreground md:text-lg">
            ChatChit là hệ thống chat realtime hỗ trợ người dùng đăng ký,
            đăng nhập, quản lý bạn bè, tạo cuộc trò chuyện và gửi tin nhắn
            nhanh chóng. Đề tài tập trung xây dựng một nền tảng giao tiếp
            trực tuyến đơn giản, thân thiện và dễ sử dụng.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button size="lg" onClick={() => navigate("/signin")}>
              Đăng nhập ngay
            </Button>

            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/signup")}
            >
              Tạo tài khoản
            </Button>
          </div>
        </div>

        {/* Card preview */}
        <div className="rounded-3xl border bg-card p-5 shadow-sm">
          <div className="mb-5 flex items-center justify-between border-b pb-4">
            <div>
              <h3 className="font-semibold">ChatChit Preview</h3>
              <p className="text-sm text-muted-foreground">
                Giao diện trò chuyện realtime
              </p>
            </div>
            <div className="h-3 w-3 rounded-full bg-green-500" />
          </div>

          <div className="space-y-4">
            <div className="max-w-[80%] rounded-2xl bg-muted px-4 py-3">
              <p className="text-sm">Xin chào, bạn đang online không?</p>
            </div>

            <div className="ml-auto max-w-[80%] rounded-2xl bg-primary px-4 py-3 text-primary-foreground">
              <p className="text-sm">Có nè, mình đang dùng ChatChit 😄</p>
            </div>

            <div className="max-w-[80%] rounded-2xl bg-muted px-4 py-3">
              <p className="text-sm">Ứng dụng này nhắn tin realtime khá tiện!</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto grid max-w-6xl grid-cols-1 gap-5 px-6 pb-20 md:grid-cols-3">
        <div className="rounded-2xl border bg-card p-6 shadow-sm">
          <Zap className="mb-4 text-primary" />
          <h3 className="mb-2 text-lg font-semibold">Realtime</h3>
          <p className="text-sm leading-6 text-muted-foreground">
            Tin nhắn được gửi và nhận nhanh chóng, giúp cuộc trò chuyện diễn ra
            mượt mà hơn.
          </p>
        </div>

        <div className="rounded-2xl border bg-card p-6 shadow-sm">
          <Users className="mb-4 text-primary" />
          <h3 className="mb-2 text-lg font-semibold">Quản lý bạn bè</h3>
          <p className="text-sm leading-6 text-muted-foreground">
            Người dùng có thể tìm kiếm, kết bạn và bắt đầu cuộc trò chuyện với
            bạn bè.
          </p>
        </div>

        <div className="rounded-2xl border bg-card p-6 shadow-sm">
          <ShieldCheck className="mb-4 text-primary" />
          <h3 className="mb-2 text-lg font-semibold">Bảo mật tài khoản</h3>
          <p className="text-sm leading-6 text-muted-foreground">
            Hệ thống có chức năng đăng ký, đăng nhập và bảo vệ các trang cần xác
            thực.
          </p>
        </div>
      </section>
    </main>
  );
};

export default HomePage;