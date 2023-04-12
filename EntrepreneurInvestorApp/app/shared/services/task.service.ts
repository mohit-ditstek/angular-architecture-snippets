import { Injectable } from '@angular/core';
import { CommonHttpService } from '../../core/services/common-http.service';
import { map } from 'rxjs/internal/operators/map';
import { HttpParams } from '@angular/common/http';

interface Task {
  dueDate: string,
  name: string,
  detail: string
  version?: number
}
@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private commonHttpService: CommonHttpService) { }

  getTaskByEntity(entityType,month,year){
    const params = new HttpParams()
    .set('month', `${month}`)
    .set('year', `${year}`)
    return this.commonHttpService.get(`task/${entityType}?`+`${params}`).pipe(map((res) => {
      return res;
    }));
  }
  getTasks() {
    return this.commonHttpService.get('task?pageNumber=1&pageSize=10').pipe(map((res) => {
      return res;
    }));
  }

  createTask(task: Task) {
    return this.commonHttpService.post(`task`, task)
  }

  deleteTask(taskId: number) {
    return this.commonHttpService.delete(`task`, taskId)
  }

  updateTask(id, task) {
    return this.commonHttpService.put(`task/${id}`, task)
  }

  markTaskCompleted(id) {
    return this.commonHttpService.patch(`task/${id}/markComplete`, null)
  }
  getCompletedTasks(month, year) {
    const params = new HttpParams()
    .set('month', `${month}`)
    .set('year', `${year}`)
    return this.commonHttpService.get(`task/completed?${params}`)
  }

}
