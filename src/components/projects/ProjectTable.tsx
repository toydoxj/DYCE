import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Project } from "@/types";

interface ProjectTableProps {
  projects: Project[];
}

export function ProjectTable({ projects }: ProjectTableProps) {
  if (projects.length === 0) {
    return (
      <div className="py-20 text-center text-muted-foreground">
        검색 결과가 없습니다.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[200px]">용역명</TableHead>
            <TableHead>용도</TableHead>
            <TableHead>업무내용</TableHead>
            <TableHead>구조형식</TableHead>
            <TableHead className="text-right">지상층수</TableHead>
            <TableHead className="text-right">연면적(m²)</TableHead>
            <TableHead>진행단계</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project) => (
            <TableRow key={project.id}>
              <TableCell className="font-medium">{project.projectName}</TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {project.usage.map((u) => (
                    <Badge key={u} variant="outline" className="text-xs font-normal">
                      {u}
                    </Badge>
                  ))}
                </div>
              </TableCell>
              <TableCell>
                <span className="text-xs text-muted-foreground">
                  {project.workScope.join(", ") || "-"}
                </span>
              </TableCell>
              <TableCell>
                <span className="text-xs text-muted-foreground">
                  {project.structureType.join(", ")}
                </span>
              </TableCell>
              <TableCell className="text-right">
                {project.aboveGroundFloors ?? "-"}
              </TableCell>
              <TableCell className="text-right">
                {project.totalFloorArea?.toLocaleString() ?? "-"}
              </TableCell>
              <TableCell>
                {project.status && (
                  <Badge variant="secondary" className="text-xs">
                    {project.status}
                  </Badge>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
