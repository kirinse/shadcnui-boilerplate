import {
  Archive,
  ArchiveX,
  ChartColumn,
  ChartLine,
  ChartNoAxesCombined,
  ChartPie,
  File,
  Gauge,
  Info,
  MessagesSquare,
  Orbit,
  ShoppingCart,
  Trash2,
  Users2,
} from "lucide-react"

import type { IMenu } from "@/models/menu"

export const accounts = [
  {
    label: "Alicia Koch",
    email: "alicia@example.com",
    icon: (
      <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <title>Vercel</title>
        <path d="M24 22.525H0l12-21.05 12 21.05z" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: "Alicia Koch",
    email: "alicia@gmail.com",
    icon: (
      <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <title>Gmail</title>
        <path
          d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    label: "Alicia Koch",
    email: "alicia@me.com",
    icon: (
      <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <title>iCloud</title>
        <path
          d="M13.762 4.29a6.51 6.51 0 0 0-5.669 3.332 3.571 3.571 0 0 0-1.558-.36 3.571 3.571 0 0 0-3.516 3A4.918 4.918 0 0 0 0 14.796a4.918 4.918 0 0 0 4.92 4.914 4.93 4.93 0 0 0 .617-.045h14.42c2.305-.272 4.041-2.258 4.043-4.589v-.009a4.594 4.594 0 0 0-3.727-4.508 6.51 6.51 0 0 0-6.511-6.27z"
          fill="currentColor"
        />
      </svg>
    ),
  },
]

export const menus: IMenu[] = [
  {
    title: "dashboard",
    icon: Gauge,
    children: [{
      title: "OverView",
      label: "128",
      icon: Gauge,
      to: "/dashboard/overview",
    }, {
      title: "analysis",
      label: "9",
      icon: ChartNoAxesCombined,
      to: "/dashboard/analysis",
    }, {
      title: "workplace",
      label: "",
      icon: Orbit,
      to: "/dashboard/workplace",
    }],
  },
  {
    title: "Forms",
    label: "12",
    icon: MessagesSquare,
    children: [{
      title: "basic form",
      label: "23",
      icon: ArchiveX,
      to: "/form/basic-form",
    }, {
      title: "step form",
      label: "",
      icon: Trash2,
      to: "/form/step-form",
    }, {
      title: "advanced form",
      label: "",
      icon: Archive,
      to: "/form/advanced-form",
    }],
  },
  {
    title: "Table",
    icon: MessagesSquare,
    children: [{
      title: "basic list",
      label: "128",
      icon: MessagesSquare,
      to: "/list/basic-list",
    }, {
      title: "table list",
      label: "972",
      icon: Users2,
      to: "/list/table-list",
    }, {
      title: "card list",
      label: "8",
      icon: ShoppingCart,
      to: "/list/card-list",
    }],
  },
  {
    title: "Charts",
    label: "",
    icon: MessagesSquare,
    children: [{
      title: "bar chart",
      icon: ChartColumn,
      to: "/chart/bar-chart",
    }, {
      title: "line chart",
      icon: ChartLine,
      to: "/chart/line-chart",
    }, {
      title: "pie chart",
      icon: ChartPie,
      to: "/chart/pie-chart",
    }],
  },
  {
    title: "settings",
    icon: File,
    to: "/settings",
    // children: [{
    //   title: "profile",
    //   label: "",
    //   icon: Send,
    //   to: "/settings/profile",
    // }],
  },
  {
    title: "System",
    label: "",
    icon: Info,
    children: [{
      title: "About",
      label: "",
      icon: Info,
      to: "/system/about",
    }],
  },
]
