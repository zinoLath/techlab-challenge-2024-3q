import { Box, MenuItem, Select, TextField } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { api } from "../services/api";
import { useAccessToken } from "../hooks/useAuthenticationContext";
import { IUser } from "../interfaces/IUser";
import { useState } from "react";
import { LoadingButton } from "@mui/lab";
import SaveIcon from '@mui/icons-material/Save'

export function CreateUser() {

  const [message,setMessage] = useState("");
  const [messageStyle,setMessageStyle] = useState({color: "black"});

  const accessToken = useAccessToken()

  const save = useMutation({
    mutationFn: async (user: Partial<IUser>) => {
      var req;
      try {
        req = await api.post(`/users`, { ...user, id: self.crypto.randomUUID() }, {
          headers: { Authorization: `Bearer ${accessToken}` }
        })
        if(req.status == 201){
          setMessageStyle({color: "green"})
          setMessage("User created succesfully")
        }
      } catch (error: any) {  
        req = error.response
        if(req.status == 400)
        {
          setMessageStyle({color: "red"})
          setMessage(req.data.message)
        }
      }
    }
  })

  const form = useForm<Partial<IUser>>({})

  return (
    <Box>
      <Box>
        <TextField label="Username" {...form.register('username')} fullWidth />
      </Box>
      <Box>
        <TextField label="E-mail" {...form.register('email')} fullWidth />
      </Box>
      <Box>
        <TextField label="Password" {...form.register('password')} type="password" fullWidth />
      </Box>
      <Box>
        <Select label="Profile" {...form.register('profile')} fullWidth>
          <MenuItem value='standard'>Standard</MenuItem>
          <MenuItem value='sudo'>Sudo</MenuItem>
        </Select>
      </Box>
      <Box>
      <LoadingButton loading={save.isPending} variant="contained" style={{ padding: 16 }} startIcon={<SaveIcon />} onClick={
        // @ts-expect-error: I know exactly what I'm doing ok?
        form.handleSubmit(save.mutate)}
      >
        Criar
      </LoadingButton>
      </Box>
      <p style={messageStyle}>{message}</p>
    </Box>
  )
}