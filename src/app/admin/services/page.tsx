"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/shared/error-state";
import { EmptyState } from "@/components/shared/empty-state";
import { apiPath } from "@/lib/utils";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";

interface Service {
  id: string;
  name: string;
  description: string;
  summary: string;
  price: number;
  duration: number;
  imageUrl: string | null;
  category: string;
  isActive: boolean;
  sortOrder: number;
  _count?: { bookings: number };
}

const defaultForm = {
  name: "",
  description: "",
  summary: "",
  price: "0",
  duration: "60",
  imageUrl: "",
  category: "general",
  sortOrder: "0",
};

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(defaultForm);
  const [saving, setSaving] = useState(false);

  const fetchServices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(apiPath("/api/admin/services"));
      const data = await res.json();
      if (data.success) {
        setServices(data.data);
      } else {
        setError(data.error);
      }
    } catch {
      setError("加载服务列表失败");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const openCreate = () => {
    setEditingId(null);
    setForm(defaultForm);
    setDialogOpen(true);
  };

  const openEdit = (service: Service) => {
    setEditingId(service.id);
    setForm({
      name: service.name,
      description: service.description,
      summary: service.summary,
      price: String(service.price),
      duration: String(service.duration),
      imageUrl: service.imageUrl || "",
      category: service.category,
      sortOrder: String(service.sortOrder),
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.summary) {
      toast.error("名称和简介不能为空");
      return;
    }
    setSaving(true);
    try {
      const body = {
        name: form.name,
        description: form.description,
        summary: form.summary,
        price: parseFloat(form.price) || 0,
        duration: parseInt(form.duration) || 60,
        imageUrl: form.imageUrl || null,
        category: form.category,
        sortOrder: parseInt(form.sortOrder) || 0,
      };

      const url = editingId
        ? apiPath(`/api/admin/services/${editingId}`)
        : apiPath("/api/admin/services");
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(editingId ? "服务已更新" : "服务已创建");
        setDialogOpen(false);
        fetchServices();
      } else {
        toast.error(data.error);
      }
    } catch {
      toast.error("保存失败");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("确定要删除该服务吗？")) return;
    try {
      const res = await fetch(apiPath(`/api/admin/services/${id}`), { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        toast.success(data.data?.message || "服务已删除");
        fetchServices();
      } else {
        toast.error(data.error);
      }
    } catch {
      toast.error("删除失败");
    }
  };

  const handleToggleActive = async (service: Service) => {
    try {
      const res = await fetch(apiPath(`/api/admin/services/${service.id}`), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !service.isActive }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`服务已${service.isActive ? "下架" : "上架"}`);
        fetchServices();
      }
    } catch {
      toast.error("更新失败");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">服务管理</h1>
        <Button onClick={openCreate}>
          <Plus className="w-4 h-4 mr-2" /> 添加服务
        </Button>
      </div>

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : error ? (
        <ErrorState message={error} onRetry={fetchServices} />
      ) : services.length === 0 ? (
        <EmptyState
          title="暂无服务"
          description="创建第一个服务以开始接受预约。"
          action={{ label: "添加服务", onClick: openCreate }}
        />
      ) : (
        <div className="overflow-x-auto border rounded-lg">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50 text-left">
                <th className="p-3 font-medium">名称</th>
                <th className="p-3 font-medium">分类</th>
                <th className="p-3 font-medium">价格</th>
                <th className="p-3 font-medium">时长</th>
                <th className="p-3 font-medium">状态</th>
                <th className="p-3 font-medium">预约数</th>
                <th className="p-3 font-medium">操作</th>
              </tr>
            </thead>
            <tbody>
              {services.map((s) => (
                <tr key={s.id} className="border-t hover:bg-muted/30">
                  <td className="p-3 font-medium">{s.name}</td>
                  <td className="p-3">{s.category}</td>
                  <td className="p-3">¥{Number(s.price)}</td>
                  <td className="p-3">{s.duration} 分钟</td>
                  <td className="p-3">
                    <button onClick={() => handleToggleActive(s)}>
                      <Badge variant={s.isActive ? "default" : "secondary"}>
                        {s.isActive ? "已上架" : "已下架"}
                      </Badge>
                    </button>
                  </td>
                  <td className="p-3">{s._count?.bookings || 0}</td>
                  <td className="p-3">
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" onClick={() => openEdit(s)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(s.id)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingId ? "编辑服务" : "添加服务"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>名称 *</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <Label>简介 *</Label>
              <Input value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} />
            </div>
            <div>
              <Label>详细描述 *</Label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={4}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>价格 (¥)</Label>
                <Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
              </div>
              <div>
                <Label>时长 (分钟)</Label>
                <Input type="number" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>分类</Label>
                <Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
              </div>
              <div>
                <Label>排序</Label>
                <Input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: e.target.value })} />
              </div>
            </div>
            <div>
              <Label>图片链接</Label>
              <Input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />
            </div>
            <Button onClick={handleSave} className="w-full" disabled={saving}>
              {saving ? "保存中..." : editingId ? "更新" : "创建"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
