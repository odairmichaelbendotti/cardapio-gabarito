import { Link } from "react-router";
import Input from "../components/Input";
import Button from "../components/Button";
import { useState, useContext } from "react";
import { useNavigate } from "react-router";
import { UserContext } from "../context/UserContext";

const Register = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [cep, setCep] = useState<string>("");
  const [error, setError] = useState<string>("");

  const { setUser } = useContext(UserContext);

  const navigate = useNavigate();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Senhas não conferem.");
      return;
    } else {
      setError("");
    }

    try {
      const response = await fetch("http://localhost:3000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, cep }),
        credentials: "include",
      });
      const data = await response.json();

      if (!data.status) {
        setError(data.message);
        return;
      }

      setUser(data.user);
      navigate("/");
    } catch (err) {
      console.log(err);
      return;
    }
  }

  return (
    <form
      className="bg-[#161410] h-screen flex flex-col gap-4 justify-center items-center"
      onSubmit={onSubmit}
    >
      <div className="max-w-[834px] flex flex-col items-center justify-center gap-4 w-full">
        <Link to="/" className="mb-4">
          <img src="./logo.png" alt="Logo Casa do Hamburger" />
        </Link>

        <div className="flex flex-col gap-4">
          <Input
            placeholder="Nome completo"
            type="text"
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            placeholder="E-mail"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            placeholder="Senha"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <Input
            placeholder="Confirme sua senha"
            type="password"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <Input
            placeholder="CEP"
            type="text"
            onChange={(e) => setCep(e.target.value)}
          />
          {error && <p className="text-[#B7280E] font-bold">{error}</p>}
          <div className="flex flex-col gap-2 mt-2">
            <Button text="Criar conta" variant="default" />
            <Link to="/signin">
              <Button text="Já tenho uma conta" variant="outline" />
            </Link>
          </div>
        </div>
      </div>
    </form>
  );
};

export default Register;
