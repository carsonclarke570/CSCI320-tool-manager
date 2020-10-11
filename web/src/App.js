import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import MenuBar from './components/MenuBar';
import Collection from './pages/collection/Collection';
import Users from './pages/Users';

import { createMuiTheme, makeStyles, ThemeProvider } from '@material-ui/core/styles';
import PersonIcon from '@material-ui/icons/Person';
import HomeIcon from '@material-ui/icons/Home';

import teal from '@material-ui/core/colors/teal';
import orange from '@material-ui/core/colors/orange';

const navlinks = [
  {route: '/', name: 'Home', icon: HomeIcon, page: Collection },
  {route: '/collection/', name: 'Collection', icon: PersonIcon, page: Collection },
  {route: '/users/', name: 'Users', icon: PersonIcon, page: Users },
];

const theme = createMuiTheme({
  palette: {
    primary: {
      main: teal[400],
    },
    secondary: {
      main: orange['A400']
    }
  }
});

const useStyles = makeStyles((theme) => ({
  paper: {
    width: '100%',
    height: '100%',
    borderRadius: 0,
    paddingLeft: theme.spacing(4),
    padddingRight: theme.spacing(4),
    paddingTop: theme.spacing(1)
  }
}));

function App() {
  const classes = useStyles();

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <MenuBar links={navlinks}>
          <div className={classes.paper}>
            <Switch>
              {navlinks.map(link => (
                <Route exact path={link.route} key={link.route}>
                    {
                      link.page()
                    }
                </Route>
              ))}
            </Switch>
          </div>
        </MenuBar>
      </Router>
    </ThemeProvider>
    
  );
}

export default App;
