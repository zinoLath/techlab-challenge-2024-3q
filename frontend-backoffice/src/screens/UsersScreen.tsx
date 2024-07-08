import { useQuery } from "@tanstack/react-query"
import { api } from "../services/api.js"
import { useAccessToken } from "../hooks/useAuthenticationContext.js"
import { IUser } from "../interfaces/IUser.js"
import { Box, Typography } from "@mui/material"
import { Link } from "react-router-dom"
import Button from '@mui/material/Button';

export function UsersScreen() {
  const accessToken = useAccessToken()
  const query = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await api.get('/users', {
        headers: { Authorization: `Bearer ${accessToken}` }
      })

      return response.data as {
        count: number
        users: IUser[]
      }
    },
  })

  const users = query.data?.users

  return (
    <>
      
      <Link to="/users/create">
        <Button
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Criar Usuário
        </Button>
      </Link>
      <Box>
        {users?.map(user => (
          <Link to={`/users/${user.id}`}>
            <Box key={`users:${user.id}`}>
              <Typography>
                {user.username}
              </Typography>
            </Box>
          </Link>
        ))}
      </Box>
    </>
  )
}