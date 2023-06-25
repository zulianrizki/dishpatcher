import { Authenticated, GitHubBanner, Refine } from "@refinedev/core";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";

import {
  AuthPage,
  ErrorComponent,
  notificationProvider,
  RefineSnackbarProvider,
  ThemedLayoutV2,
  ThemedTitleV2,
} from "@refinedev/mui";

import CssBaseline from "@mui/material/CssBaseline";
import GlobalStyles from "@mui/material/GlobalStyles";
import routerBindings, {
  CatchAllNavigate,
  DocumentTitleHandler,
  NavigateToResource,
  UnsavedChangesNotifier,
} from "@refinedev/react-router-v6";
import { dataProvider, liveProvider } from "@refinedev/supabase";
import { useTranslation } from "react-i18next";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import authProvider from "./authProvider";
import { AppIcon } from "./components/app-icon";
import { Header } from "./components/header";
import { ColorModeContextProvider } from "./contexts/color-mode";
import {
  MenuCreate,
  MenuEdit,
  MenuList,
  MenuShow,
} from "./pages/menus";
import {
  RestaurantCreate,
  RestaurantEdit,
  RestaurantList,
  RestaurantShow,
} from "./pages/restaurant";
import { supabaseClient } from "./utility";

function App() {
  const { t, i18n } = useTranslation();

  const i18nProvider = {
    translate: (key: string, params: object) => t(key, params),
    changeLocale: (lang: string) => i18n.changeLanguage(lang),
    getLocale: () => i18n.language,
  };

  return (
    <BrowserRouter>
      <GitHubBanner />
      <RefineKbarProvider>
        <ColorModeContextProvider>
          <CssBaseline />
          <GlobalStyles styles={{ html: { WebkitFontSmoothing: "auto" } }} />
          <RefineSnackbarProvider>
            <Refine
              dataProvider={dataProvider(supabaseClient)}
              liveProvider={liveProvider(supabaseClient)}
              authProvider={authProvider}
              routerProvider={routerBindings}
              notificationProvider={notificationProvider}
              i18nProvider={i18nProvider}
              resources={[
                {
                  name: "menus",
                  list: "/menu",
                  create: "/menu/create",
                  edit: "/menu/edit/:id",
                  show: "/menu/show/:id",
                  meta: {
                    canDelete: true,
                  },
                },
                {
                  name: "restaurants",
                  list: "/restaurant",
                  create: "/restaurant/create",
                  edit: "/restaurant/edit/:id",
                  show: "/restaurant/show/:id",
                  meta: {
                    canDelete: true,
                  },
                },
              ]}
              options={{
                syncWithLocation: true,
                warnWhenUnsavedChanges: true,
              }}
            >
              <Routes>
                <Route
                  element={
                    <Authenticated fallback={<CatchAllNavigate to="/login" />}>
                      <ThemedLayoutV2
                        Header={() => <Header sticky />}
                        Title={({ collapsed }) => (
                          <ThemedTitleV2
                            collapsed={collapsed}
                            text="refine Projecter"
                            icon={<AppIcon />}
                          />
                        )}
                      >
                        <Outlet />
                      </ThemedLayoutV2>
                    </Authenticated>
                  }
                >
                  <Route
                    index
                    element={<NavigateToResource resource="blog_posts" />}
                  />
                  <Route path="/menu">
                    <Route index element={<MenuList />} />
                    <Route path="create" element={<MenuCreate />} />
                    <Route path="edit/:id" element={<MenuEdit />} />
                    <Route path="show/:id" element={<MenuShow />} />
                  </Route>
                  <Route path="/restaurant">
                    <Route index element={<RestaurantList />} />
                    <Route path="create" element={<RestaurantCreate />} />
                    <Route path="edit/:id" element={<RestaurantEdit />} />
                    <Route path="show/:id" element={<RestaurantShow />} />
                  </Route>
                  <Route path="*" element={<ErrorComponent />} />
                </Route>
                <Route
                  element={
                    <Authenticated fallback={<Outlet />}>
                      <NavigateToResource />
                    </Authenticated>
                  }
                >
                  <Route
                    path="/login"
                    element={
                      <AuthPage
                        type="login"
                        title={
                          <ThemedTitleV2
                            collapsed={false}
                            text="refine Projecter"
                            icon={<AppIcon />}
                          />
                        }
                        formProps={{
                          defaultValues: {
                            email: "info@refine.dev",
                            password: "refine-supabase",
                          },
                        }}
                      />
                    }
                  />
                  <Route
                    path="/register"
                    element={<AuthPage type="register" />}
                  />
                  <Route
                    path="/forgot-password"
                    element={<AuthPage type="forgotPassword" />}
                  />
                </Route>
              </Routes>

              <RefineKbar />
              <UnsavedChangesNotifier />
              <DocumentTitleHandler />
            </Refine>
          </RefineSnackbarProvider>
        </ColorModeContextProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;
