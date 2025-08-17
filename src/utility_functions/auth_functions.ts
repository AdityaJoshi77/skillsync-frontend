import api from "@/lib/axios";

interface LoginData{
    email:string,
    password:string
}

interface SignUpData{
    name: string,
    email: string,
    password: string
}

const loginFunction = async ({email, password} : LoginData) => {
  const apiResponse = await api.post("/auth/login", {
    email,
    password
  });
  return apiResponse;
};

const signUpFunction = async ({name, email, password}: SignUpData) => {
    const apiResponse = await api.post('/auth/register',{
            name,
            email,
            password
        });
    return apiResponse;
}

export {loginFunction, signUpFunction};