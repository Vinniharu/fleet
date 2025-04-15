import LoginForm from "../components/login/LoginForm";

export default function Login() {
  return (
    <div className="flex items-center justify-center h-screen">
      <section className="hidden md:flex w-1/2 items-center justify-center bg-gray-400 h-full">
        <img src="/images/icon.webp" alt="Briech Logo" />
      </section>
      <section className="w-full md:w-1/2 flex items-center justify-center bg-gray-900 h-full p-4">
        <LoginForm />
      </section>
    </div>
  );
}
