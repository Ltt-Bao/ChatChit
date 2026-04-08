import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "../ui/label"
import {z} from 'zod'
import {useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'

const signUpSchema = z.object({
  firstname: z.string().min(1, "Tên bắt buộc phải có"),
  lastname: z.string().min(1, "Họ bắt buộc phải có"),
  username: z.string().min(3, "Tên đăng nhập phải có ít nhất 3 kí tự"),
  email: z.email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 kí tự")
});

type signUpFormValues = z.infer<typeof signUpSchema>

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {

  const {register, handleSubmit, formState: {errors, isSubmitting}} = useForm<signUpFormValues>({
    resolver: zodResolver(signUpSchema)
  });
  const onSubmit = async (data: signUpFormValues) => {
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
                      {...register("lastname")}
                    />
                    {/* error */}
                    {errors.lastname && (
                      <p className="text-destructive text-sm">
                        {errors.lastname.message}
                      </p>
                    )}
                  </div>


                  <div className="space-y-2">
                    <Label htmlFor="firstname" className="block text-sm">Tên</Label>
                    <Input
                      type="text"
                      id="firstname"
                      {...register("firstname")}
                    />
                    {/* error */}
                    {errors.firstname && (
                      <p className="text-destructive text-sm">
                        {errors.firstname.message}
                      </p>
                    )}
                  </div>
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
              {/* email */}
                  <div className="flex flex-col gap-3">
                    <Label htmlFor="email" className="block text-sm">Email</Label>
                    <Input
                      type="email"
                      id="email"
                      placeholder="chatchit@gmail.com"
                      {...register("email")}
                    />
                    {/* error */}
                    {errors.email && (
                      <p className="text-destructive text-sm">
                        {errors.email.message}
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
              {/* nút signup */}
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
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
