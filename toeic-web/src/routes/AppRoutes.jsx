import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Các trang (các phần này sẽ thêm sau)
import HomePage from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import NotFound from "../pages/NotFound/NotFound";
import ProtectedRoute from "./ProtectedRoute";

// Layout
import MainLayout from "../layouts/MainLayout";
import Register from "../pages/Register/Register";
import { MockTest } from "../pages/MockTest/MockTest";
import { Test } from "../pages/MockTest/Test";
import ForgotPassword from "../pages/ForgotPassword/ForgotPassword";
import ResetPassword from "../pages/ForgotPassword/ResetPassword";
import Leaderboard from "../pages/Leaderboard/Leaderboard";
import Result from "../pages/MockTest/Result";
import Settings from "../pages/Settings/Settings";
import EditSettings from "../pages/Settings/EditSettings/EditSettings";
import Payment from "../pages/Payment/Payment";
import PaymentForm from "../pages/Payment/PaymentForm/PaymentForm"; // Giả lập trạng thái Auth
import Resource from "../pages/Resource/Resource";
import History from "../pages/History/History";
import { Practice } from "../pages/Practice/Practice";
import ResourceDetail from "../pages/Resource/ResourceDetail";
import DashboardPage from "../pages/Admin/Dashboard/Dashboard";
import UserManagementPage from "../pages/Admin/UserManagement/UserManagement";
import TestManagementPage from "../pages/Admin/TestManagement/TestManagement";
const isAuthenticated = false; // Kiểm tra trạng thái đăng nhập

// Cấu hình routes
const routes = [
	{
		path: "/", // Trang Home, cho mọi user
		element: (
			<MainLayout>
				<HomePage />
			</MainLayout>
		),
	},
	{
		path: "/login", // Trang dành cho Guest (Guest-only)
		element: (
			<ProtectedRoute isAuthenticated={isAuthenticated} guestOnly={true}>
				<MainLayout>
					<Login />
				</MainLayout>
			</ProtectedRoute>
		),
	},
	{
		path: "/forgot-password", // Trang dành cho Guest (Guest-only)
		element: (
			<ProtectedRoute isAuthenticated={isAuthenticated} guestOnly={true}>
				<MainLayout>
					<ForgotPassword />
				</MainLayout>
			</ProtectedRoute>
		),
	},
	{
		path: "*", // Trang 404
		element: (
			<MainLayout>
				<NotFound />
			</MainLayout>
		),
	},
	{
		path: "/reset-password", // Trang 404
		element: (
			<MainLayout>
				<ResetPassword />
			</MainLayout>
		),
	},

	{
		path: "/register",
		element: (
			<MainLayout>
				<Register />
			</MainLayout>
		),
	},

	{
		path: "/mock-test",
		element: (
			<MainLayout>
				<MockTest />
			</MainLayout>
		),
	},
	{
		path: "/mock-test/:id",
		element: (
			<MainLayout>
				<Test isView={false} />
			</MainLayout>
		),
	},
	{
		path: "/mock-test/view/:id",
		element: (
			<MainLayout>
				<Test isView={true} />
			</MainLayout>
		),
	},

	{
		path: "/leaderboard",
		element: (
			<MainLayout>
				<Leaderboard />
			</MainLayout>
		),
	},
	{
		path: "/result/:id",
		element: (
			<MainLayout>
				<Result
					totalQuestions={100}
					correctAnswers={90}
					wrongAnswers={10}
					skippedQuestions={0}
					score={90}
				/>
			</MainLayout>
		),
	},

	{
		path: "/settings",
		element: (
			<MainLayout>
				<Settings />
			</MainLayout>
		),
	},
	{
		path: "/settings/editsettings",
		element: (
			<MainLayout>
				<EditSettings />
			</MainLayout>
		),
	},
	{
		path: "/payment",
		element: (
			<MainLayout>
				<Payment />
			</MainLayout>
		),
	},
	{
		path: "/payment/paymentform",
		element: (
			<MainLayout>
				<PaymentForm />
			</MainLayout>
		),
	},
	{
		path: "/resource",
		element: (
			<MainLayout>
				<Resource />
			</MainLayout>
		),
	},
	{
		path: "/resource/:id",
		element: (
			<MainLayout>
				<ResourceDetail />
			</MainLayout>
		),
	},
	{
		path: "/history",
		element: (
			<MainLayout>
				<History />
			</MainLayout>
		),
	},
	{
		path: "/practice",
		element: (
			<MainLayout>
				<Practice />
			</MainLayout>
		),
	},
	{
		path: "/admin/dashboard",
		element: (
			<MainLayout>
				<DashboardPage />
			</MainLayout>
		),
	},
	{
		path: "/admin/usermanagement",
		element: (
			<MainLayout>
				<UserManagementPage />
			</MainLayout>
		),
	},
	{
		path: "/admin/testmanagement",
		element: (
			<MainLayout>
				<TestManagementPage />
			</MainLayout>
		),
	},
];

const AppRoutes = () => {
	const router = createBrowserRouter(routes);
	return <RouterProvider router={router} />;
};

export default AppRoutes;
