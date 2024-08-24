import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { IResponse, IUser } from "../interfaces";
import { Injectable, inject } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class BaseService<T> {
  protected source!: string;
  protected http = inject(HttpClient);

  public find(id: string | number): Observable<IResponse<T>> {
    return this.http.get<IResponse<T>>(this.source + "/" + id);
  }

  public findAll(s: string = ""): Observable<IResponse<T[]>> {
    return this.http.get<IResponse<T[]>>(this.source, { params: { s } });
  }
  
  public findByUserId(userId: number): Observable<IResponse<T[]>> {
    return this.http.get<IResponse<T[]>>(`${this.source}/userId/${userId}`);
  }

  public findHistory(userId: number): Observable<IResponse<T[]>> {
    return this.http.get<IResponse<T[]>>(`${this.source}/history/${userId}`);
  }

  public findNext(userId: number): Observable<IResponse<T[]>> {
    return this.http.get<IResponse<T[]>>(`${this.source}/nextTask/${userId}`);
  }

  public findByUserId(userId: number): Observable<IResponse<T[]>> {
    return this.http.get<IResponse<T[]>>(`${this.source}/userId/${userId}`);
  }

  public findHistory(userId: number): Observable<IResponse<T[]>> {
    return this.http.get<IResponse<T[]>>(`${this.source}/history/${userId}`);
  }

  public findNext(userId: number): Observable<IResponse<T[]>> {
    return this.http.get<IResponse<T[]>>(`${this.source}/nextTask/${userId}`);
  }

  public findFutureTask(userId: number): Observable<IResponse<T[]>> {
    return this.http.get<IResponse<T[]>>(`${this.source}/futureTasks/${userId}`);
  }

  public completeTask(id: any): Observable<IResponse<T>> {
    return this.http.patch<IResponse<T>>(`${this.source}/complete/${id}`, {});
  }

  public findCompleteTask(id: any): Observable<IResponse<T[]>> {
    return this.http.get<IResponse<T[]>>(`${this.source}/verifiedTask/${id}`);
  }

  public verifyTask(id: any): Observable<IResponse<T>> {
    return this.http.put<IResponse<T>>(`${this.source}/verified/${id}`, {});
  }

  public add(data: {}): Observable<IResponse<T>> {
    return this.http.post<IResponse<T>>(this.source, data);
  }

  public edit(id: number | undefined, data: {}): Observable<IResponse<T>> {
    return this.http.put<IResponse<T>>(this.source + "/" + id, data);
  }

  public editProfile(
    id: number | undefined,
    data: {}
  ): Observable<IResponse<T>> {
    return this.http.put<IResponse<T>>(this.source + "/profile/" + id, data);
  }

  public editKidStats(
    id: number | undefined,
    data: {}
  ): Observable<IResponse<T>> {
    return this.http.put<IResponse<T>>(this.source + "/kid/" + id, data);
  }

  public editAssociate(
    id: number | undefined,
    data: {}
  ): Observable<IResponse<T>> {
    return this.http.put<IResponse<T>>(this.source + "/associate/" + id, data);
  }

  public emailData(
    id: number | undefined,
    data: {}
  ): Observable<IResponse<T>> {
    return this.http.put<IResponse<T>>(this.source + "/email/" + id, data);
  }

  public del(id: any): Observable<IResponse<T>> {
    return this.http.delete<IResponse<T>>(this.source + "/" + id);
  }


}
