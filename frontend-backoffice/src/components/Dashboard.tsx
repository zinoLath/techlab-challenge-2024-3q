import { Box, Drawer, Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { Link, Outlet } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "../services/api";
import { useAccessToken, useAuthenticatedUser } from "../hooks/useAuthenticationContext";
import { IUser } from "../interfaces/IUser";
import { useState } from "react";
import { useHasScope } from "../hooks/useAuthenticationContext.js";
import PeopleIcon from '@mui/icons-material/People'
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';

const drawerWidth = 240;

export function Dashboard() {
  const accessToken = useAccessToken()
  const user = useAuthenticatedUser()
  const [available,setAvailable] = useState(user.available)

  const save = useMutation({
    mutationFn: async (user: Partial<IUser>) => {
      var req;
      try {
        req = await api.patch(`/users/${user.id}`, {available: !user.available}, {
          headers: { Authorization: `Bearer ${accessToken}` }
        })
        user.available = !user.available
        setAvailable(user.available)
      } catch (error : any) {
      }
    }
  })

  const handleAvailable = async () => {
    console.log("test")
    save.mutate(user)
  }
  return (
    <Box sx={{ display: 'flex' }}>
      <Box
        component="nav"
        aria-label="mailbox folders"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          open
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          <div>
            <List>
              <Link to='/conversations'>
                <ListItem disablePadding>
                  <ListItemButton>
                    <ListItemIcon>
                      <QuestionAnswerIcon />
                    </ListItemIcon>
                    <ListItemText primary='Conversas' />
                  </ListItemButton>
                </ListItem>
              </Link>
              <ListItem disablePadding onClick={handleAvailable}>
                <ListItemButton>
                  <ListItemIcon>
                    <QuestionAnswerIcon />
                  </ListItemIcon>
                  <ListItemText primary={available ? "Disponível" : "Indisponível"}/>
                </ListItemButton>
              </ListItem>
              {useHasScope('users:*', 'users:read') && (
                <Link to='/users'>
                  <ListItem disablePadding>
                    <ListItemButton>
                      <ListItemIcon>
                        <PeopleIcon />
                      </ListItemIcon>
                      <ListItemText primary='Usuários' />
                    </ListItemButton>
                  </ListItem>
                </Link>
              )}
            </List>
            <Divider />
          </div>
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ flexGrow: 1, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >
        <Outlet />
      </Box>
    </Box>
  )
}