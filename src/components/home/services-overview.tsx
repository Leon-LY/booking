import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Clock, DollarSign } from "lucide-react";

interface ServiceCardProps {
  id: string;
  name: string;
  summary: string;
  price: number;
  duration: number;
  imageUrl: string | null;
  category: string;
}

export function ServiceCard({
  id,
  name,
  summary,
  price,
  duration,
  imageUrl,
  category,
}: ServiceCardProps) {
  return (
    <Card className="card-hover overflow-hidden flex flex-col">
      <div className="aspect-video bg-muted relative overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
            <span className="text-4xl font-bold text-primary/30">
              {name.charAt(0)}
            </span>
          </div>
        )}
        <Badge className="absolute top-3 left-3">{category}</Badge>
      </div>
      <CardHeader>
        <CardTitle className="text-xl">{name}</CardTitle>
        <p className="text-sm text-muted-foreground line-clamp-2">{summary}</p>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <DollarSign className="w-4 h-4" />
            {Number(price) === 0 ? "免费" : `¥${Number(price)}`}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {duration} 分钟
          </span>
        </div>
      </CardContent>
      <CardFooter>
        <Link
          href={`/services/${id}`}
          className={buttonVariants({ className: "w-full" })}
        >
          了解详情
        </Link>
      </CardFooter>
    </Card>
  );
}
