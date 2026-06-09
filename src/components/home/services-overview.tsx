import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Clock, BanknoteIcon, ArrowRight } from "lucide-react";

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
    <Card className="card-hover overflow-hidden flex flex-col group cursor-pointer">
      <div className="aspect-video bg-muted relative overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 via-primary/5 to-secondary/20 group-hover:from-primary/20 group-hover:to-secondary/30 transition-colors duration-500">
            <span className="text-5xl font-bold text-primary/20 group-hover:text-primary/30 transition-colors">
              {name.charAt(0)}
            </span>
          </div>
        )}
        <Badge className="absolute top-3 left-3 shadow-sm">{category}</Badge>
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg group-hover:text-primary transition-colors">{name}</CardTitle>
        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{summary}</p>
      </CardHeader>
      <CardContent className="flex-grow pb-3">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <BanknoteIcon className="w-4 h-4" />
            {Number(price) === 0 ? "免费" : `¥${Number(price)}`}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            {duration} 分钟
          </span>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Link
          href={`/services/${id}`}
          className={buttonVariants({ variant: "outline", className: "w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors" })}
        >
          了解详情 <ArrowRight className="ml-1.5 w-4 h-4" />
        </Link>
      </CardFooter>
    </Card>
  );
}
