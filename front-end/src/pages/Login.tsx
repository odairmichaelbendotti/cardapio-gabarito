import { Link } from "react-router";
import Input from "../components/Input";
import Button from "../components/Button";
import { useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router";
import { CartContext } from "../context/CartContext";

const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const navigate = useNavigate();

  const { setUser } = useContext(UserContext);
  const { getCartItems } = useContext(CartContext);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !password) {
      setError("E-mail e senha são obrigatórios.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      const data = await response.json();

      if (!data.status) {
        setError(data.message);
        return;
      }
      setUser(data.user);
      await getCartItems();
      navigate("/");
    } catch (err) {
      console.log(err);
      return;
    }
  };

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
            placeholder="E-mail"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            placeholder="Senha"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="font-bold text-[#C92A0E]">{error}</p>}
          <div className="flex flex-col gap-2 mt-2">
            <Button text="Login" variant="default" />
            <Link to="/signup">
              <Button text="Não tenho uma conta" variant="outline" />
            </Link>
          </div>
        </div>
      </div>
    </form>
  );
};

export default Login;
