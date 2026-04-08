import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "./ui/label"

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8">
            <div className="flex flex-col gap-3">
              {/* header - logo */}
              <div className="flex flex-col items-center text-center gap-2">
                <a href="/" className="mx-auto block w-fit text-center">
                  <img src="/chatchit-logo.svg" alt="logo" />
                </a>
                <h1 className="text-2xl font-bold ">
                  Tạo tài khoản ChatChit
                </h1>
                <p className="text-muted-foreground text-balance">
                  Chào mừng ní, hãy đăng kí để chém gió nào!!
                </p>
              </div>
              {/* họ tên */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="lastname" className="block text-sm">Họ</Label>
                    <Input
                      type="text"
                      id="lastname"
                    />
                    {/* error */}
                  </div>


                  <div className="space-y-2">
                    <Label htmlFor="firstname" className="block text-sm">Tên</Label>
                    <Input
                      type="text"
                      id="firstname"
                    />
                    {/* error */}
                  </div>
                </div>
              {/* user name */}
                  <div className="flex flex-col gap-3">
                    <Label htmlFor="username" className="block text-sm">Tên đăng nhập</Label>
                    <Input
                      type="text"
                      id="username"
                      placeholder="ChatChit"
                    />
                    {/* error */}
                  </div>
              {/* email */}
                  <div className="flex flex-col gap-3">
                    <Label htmlFor="email" className="block text-sm">Email</Label>
                    <Input
                      type="email"
                      id="email"
                      placeholder="chatchit@gmail.com"
                    />
                    {/* error */}
                  </div>
              {/* password */}
                  <div className="flex flex-col gap-3">
                    <Label htmlFor="password" className="block text-sm">Mật khẩu</Label>
                    <Input
                      type="passowrd"
                      id="password"
                    />
                    {/* error */}
                  </div>
              {/* nút signup */}
                  <Button type="submit" className="w-full">
                    Tạo tài khoản
                  </Button>
                  <div className="text-center text-sm">
                    Đã có tài khoản? {" "}
                    <a href="/signin" className="underline underline-offset-4 hover:text-primary">Đăng nhập</a>
                  </div>
            </div>
          </form>
          <div className="relative hidden bg-muted md:block">
            <img
              src="/signup-removebg-preview.png"
              alt="Image"
              className="absolute top-1/2 -translate-y-1/2 object-cover"
            />
          </div>
        </CardContent>
      </Card>
      <div className="text-xs text-balance px-6 text-center *:[a]:hover:text-primary text-muted-foreground *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  )
}
