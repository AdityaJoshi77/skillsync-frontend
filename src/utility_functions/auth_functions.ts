import api from "@/lib/axios";

interface LoginData{
    email:String,
    password:String
}

interface SignUpData{
    name: String,
    email: String,
    password: String
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