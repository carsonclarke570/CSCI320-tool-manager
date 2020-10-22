import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import MenuBar from './components/MenuBar';
import Collection from './pages/collection/Collection';
import Users from './pages/users/Users';
import UserCollection from './pages/users/UserCollection';
import History from './pages/history/History';
import Search from './pages/search/Search';
import Category from './pages/category/Category';
import Projects from './pages/projects/Projects';

import { createMuiTheme, makeStyles, ThemeProvider } from '@material-ui/core/styles';
import PersonIcon from '@material-ui/icons/Person';
import HomeIcon from '@material-ui/icons/Home';
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import SearchIcon from '@material-ui/icons/Search';
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted';

import teal from '@material-ui/core/colors/teal';
import orange from '@material-ui/core/colors/orange';

import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';

const navlinks = [
  {route: '/', name: 'Home', icon: HomeIcon, page: Collection },
  {route: '/search/', name: "Search", icon: SearchIcon, page: Search },
  {route: '/collection/', name: 'Collection', icon: LibraryBooksIcon, page: Collection },
  {route: '/projects/', name: 'Projects', icon: FormatListBulletedIcon, page: Projects },
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
      <MuiPickersUtilsProvider utils={MomentUtils}>
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
                <Route exact path="/users/:id/collection/" key="user-collection">
                      <UserCollection />
                </Route>
                <Route exact path="/history/:id/" key="tool-history">
                      <History />
                </Route>
                <Route exact path="/category/:id/" key="category">
                      <Category />
                </Route>
              </Switch>
            </div>
          </MenuBar>
        </Router>
      </MuiPickersUtilsProvider>
    </ThemeProvider>
    
  );
}

export default App;
