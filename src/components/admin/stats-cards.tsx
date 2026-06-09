"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarCheck, Clock, CheckCircle, Users, DollarSign } from "lucide-react";

interface StatsCardsProps {
  stats: {
    todayBookings: number;
    pendingBookings: number;
    completedBookings: number;
    totalClients: number;
    totalRevenue: number;
  };
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: "今日预约",
      value: stats.todayBookings,
      icon: CalendarCheck,
      color: "text-blue-600 bg-blue-100",
    },
    {
      title: "待确认",
      value: stats.pendingBookings,
      icon: Clock,
      color: "text-yellow-600 bg-yellow-100",
    },
    {
      title: "已完成",
      value: stats.completedBookings,
      icon: CheckCircle,
      color: "text-green-600 bg-green-100",
    },
    {
      title: "客户总数",
      value: stats.totalClients,
      icon: Users,
      color: "text-purple-600 bg-purple-100",
    },
    {
      title: "总收入",
      value: `¥${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "text-primary bg-primary/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
            <div className={`p-2 rounded-lg ${card.color}`}>
              <card.icon className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
