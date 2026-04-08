import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "../ui/label"
import {z} from 'zod'
import {useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'

const signInSchema = z.object({
  username: z.string().min(3, "Tên đăng nhập phải có ít nhất 3 kí tự"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 kí tự")
});

type signInFormValues = z.infer<typeof signInSchema>

export function SigninForm ({
  className,
  ...props
}: React.ComponentProps<"div">) {
    const {register, handleSubmit, formState: {errors, isSubmitting}} = useForm<signInFormValues>({
        resolver: zodResolver(signInSchema)
      });
    const onSubmit = async (data: signInFormValues) => {
        //gọi backend để đăng kí
    }
    return (
    <div className={cn("flex flex-col gap-6 max-h-xl mx-auto", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-3">
              {/* header - logo */}
              <div className="flex flex-col items-center text-center gap-2">
                <a href="/" className="mx-auto block w-fit text-center">
                  <img src="/chatchit-logo.svg" alt="logo" />
                </a>
                <h1 className="text-2xl font-bold ">
                  Chào mừng ní đã quay lại với ChatChit nha!!
                </h1>
                <p className="text-muted-foreground text-balance">
                  Hãy đăng nhập và tiếp tục chém gió nào
                </p>
              </div>
              {/* user name */}
                  <div className="flex flex-col gap-3">
                    <Label htmlFor="username" className="block text-sm">Tên đăng nhập</Label>
                    <Input
                      type="text"
                      id="username"
                      placeholder="ChatChit"
                      {...register("username")}
                    />
                    {/* error */}
                    {errors.username && (
                      <p className="text-destructive text-sm">
                        {errors.username.message}
                      </p>
                    )}
                  </div>
              {/* password */}
                  <div className="flex flex-col gap-3">
                    <Label htmlFor="password" className="block text-sm">Mật khẩu</Label>
                    <Input
                      type="password"
                      id="password"
                      {...register("password")}
                    />
                    {/* error */}
                    {errors.password && (
                      <p className="text-destructive text-sm">
                        {errors.password.message}
                      </p>
                    )}
                  </div>
              {/* nút signIn */}
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    Đăng nhập
                  </Button>
                  <div className="text-center text-sm">
                    Chưa có tài khoản? {" "}
                    <a href="/signup" className="underline underline-offset-4 hover:text-primary">Đăng kí đê</a>
                  </div>
            </div>
          </form>
          <div className="relative hidden bg-muted md:block">
            <img
              src="/signin-removebg-preview.png"
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