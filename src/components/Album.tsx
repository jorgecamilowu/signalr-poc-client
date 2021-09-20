import { useEffect } from "react";
import { HubConnection, HubConnectionState } from "@microsoft/signalr";
import { connect, ConnectedProps } from "react-redux";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import {
  broadcastAction,
  resetNotifications,
  startConnection,
  stopConnection,
  subscribe,
} from "../store/signalRHub/signalRActions";
import { RootState } from "../store/rootReducer";

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://material-ui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

export function Album({
  connectionId,
  notifications,
  connection,
  broadcastAction,
  startConnectionAction,
  stopConnectionAction,
  clearNotificationsAction,
  subscribeAction,
}: Props) {
  useEffect(() => {
    if (connection.state !== HubConnectionState.Connected) {
      startConnectionAction();
    }

    // cleanup on unmount
    return () => {
      stopConnectionAction();
    };
  }, [connection, startConnectionAction, stopConnectionAction]);

  return (
    <>
      <AppBar position="relative">
        <Toolbar>
          <Typography variant="h6" color="inherit" noWrap>
            POC
          </Typography>
        </Toolbar>
      </AppBar>
      <main>
        {/* Hero unit */}
        <Box
          sx={{
            bgcolor: "background.paper",
            pt: 8,
            pb: 6,
          }}
        >
          <Container maxWidth="sm">
            <Typography
              component="h1"
              variant="h2"
              align="center"
              color="text.primary"
              gutterBottom
            >
              SignalR POC Client
            </Typography>
            <Stack
              sx={{ pt: 4 }}
              direction="row"
              spacing={2}
              justifyContent="center"
            >
              <Button
                variant="contained"
                onClick={() => startConnectionAction()}
              >
                Start Connection
              </Button>
              <Button variant="outlined" onClick={() => stopConnectionAction()}>
                Stop Connection
              </Button>
              <Button
                variant="outlined"
                onClick={() => clearNotificationsAction()}
              >
                Clear Notifications
              </Button>
            </Stack>
          </Container>
        </Box>
        <Container sx={{ py: 8 }} maxWidth="md">
          {/* End hero unit */}
          <Grid container justifyContent="center">
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  {`Connection ID: ${connectionId}`}
                </Typography>
                <ul>
                  {notifications.map((notification, index) => (
                    <li key={`${notification}-${index}`}>
                      <Typography>{notification}</Typography>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => subscribeAction()}>
                  Subscribe
                </Button>
                <Button size="small" onClick={() => broadcastAction()}>
                  Broadcast
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Container>
      </main>
      {/* Footer */}
      <Box sx={{ bgcolor: "background.paper", p: 6 }} component="footer">
        <Typography variant="h6" align="center" gutterBottom>
          Footer
        </Typography>
        <Typography
          variant="subtitle1"
          align="center"
          color="text.secondary"
          component="p"
        >
          Something here to give the footer a purpose!
        </Typography>
        <Copyright />
      </Box>
      {/* End footer */}
    </>
  );
}

const mapStateToProps = ({ signalR }: RootState) => ({
  connectionId: signalR.id,
  notifications: signalR.msgs,
});

const reduxActions = {
  startConnectionAction: startConnection,
  stopConnectionAction: stopConnection,
  clearNotificationsAction: resetNotifications,
  subscribeAction: subscribe,
  broadcastAction,
};

const connector = connect(mapStateToProps, reduxActions);
export default connector(Album);

type PropsFromRedux = ConnectedProps<typeof connector>;

interface Props extends PropsFromRedux {
  connection: HubConnection;
}
