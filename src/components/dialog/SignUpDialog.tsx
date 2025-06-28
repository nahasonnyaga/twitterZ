import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import { Dialog, DialogContent, DialogTitle, TextField } from "@mui/material";
import * as yup from "yup";
import Image from "next/image";

import { SignUpDialogProps } from "@/types/DialogProps";
import CircularLoading from "../misc/CircularLoading";
import CustomSnackbar from "../misc/CustomSnackbar";
import { SnackbarProps } from "@/types/SnackbarProps";
import { supabase } from "@/utils/supabase-client";

export default function SignUpDialog({ open, handleSignUpClose }: SignUpDialogProps) {
  const [snackbar, setSnackbar] = useState<SnackbarProps>({ message: "", severity: "info", open: false });
  const router = useRouter();

  const validationSchema = yup.object({
    email: yup.string().email("Enter a valid email").required("Email is required"),
    password: yup.string().min(8, "Password should be of minimum 8 characters").max(100, "Password should be of maximum 100 characters").required("Password is required"),
    username: yup.string().min(3, "Username should be of minimum 3 characters").max(20, "Username should be of maximum 20 characters").matches(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores").required("Username is required"),
    name: yup.string().max(50, "Name should be of maximum 50 characters"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      username: "",
      name: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm }) => {
      const { error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            username: values.username,
            name: values.name,
          },
        },
      });

      if (error) {
        console.error("Sign up error:", error.message);
        return setSnackbar({ message: error.message, severity: "error", open: true });
      }

      resetForm();
      handleSignUpClose();
      router.push("/explore");
    },
  });

  return (
    <Dialog className="dialog" open={open} onClose={handleSignUpClose}>
      <Image className="dialog-icon" src="/assets/favicon.png" alt="App Icon" width={50} height={50} />
      <DialogTitle className="title">Create your account</DialogTitle>
      <form className="dialog-form" onSubmit={formik.handleSubmit}>
        <DialogContent>
          <div className="input-group">
            <div className="input">
              <TextField
                required
                fullWidth
                name="email"
                label="Email"
                placeholder="you@example.com"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
                autoFocus
              />
            </div>
            <div className="input">
              <TextField
                required
                fullWidth
                name="username"
                label="Username"
                placeholder="username"
                value={formik.values.username}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.username && Boolean(formik.errors.username)}
                helperText={formik.touched.username && formik.errors.username}
              />
            </div>
            <div className="input">
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
              />
            </div>
            <div className="input">
              <TextField
                fullWidth
                name="name"
                label="Name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
              />
            </div>
          </div>
        </DialogContent>
        {formik.isSubmitting ? (
          <CircularLoading />
        ) : (
          <button
            className={`btn btn-dark ${!formik.isValid ? "btn-disabled" : ""}`}
            type="submit"
            disabled={!formik.isValid}
          >
            Create Account
          </button>
        )}
      </form>
      {snackbar.open && <CustomSnackbar message={snackbar.message} severity={snackbar.severity} open={snackbar.open} />}
    </Dialog>
  );
}
