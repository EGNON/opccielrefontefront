import { Component, EventEmitter, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import moment from 'moment';
import {ResponseModel} from "../../../../crm/models/table.model";
import {Role} from "../../../../crm/models/access/role.model";
import {RoleService} from "../../../../crm/services/access/role.service";
import {Config} from "datatables.net";

@Component({
    selector: 'app-role-details',
    templateUrl: './role-details.component.html',
    styleUrls: ['./role-details.component.scss'],
    standalone: false
})
export class RoleDetailsComponent implements OnInit {

  role$: Observable<ResponseModel<Role>>;

  datatableConfig: Config = {};

  // Reload emitter inside datatable
  reloadEvent: EventEmitter<boolean> = new EventEmitter();

  constructor(private route: ActivatedRoute, private apiService: RoleService) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      this.role$ = this.apiService.getById(id);

      this.datatableConfig = {
        serverSide: true,
        ajax: (dataTablesParameters: any, callback) => {
          this.apiService.datatable(dataTablesParameters).subscribe(resp => {
            console.log(resp);
            callback(resp.data);
          });
        },
        columns: [
          {
            title: 'Intitulé', data: 'nom', render: function (data, type, full) {
              const colorClasses = ['success', 'info', 'warning', 'danger'];
              const randomColorClass = colorClasses[Math.floor(Math.random() * colorClasses.length)];

              const initials = data[0].toUpperCase();
              const symbolLabel = `
              <div class="symbol-label fs-3 bg-light-${randomColorClass} text-${randomColorClass}">
                ${initials}
              </div>
            `;

              const nameAndEmail = `
              <div class="d-flex flex-column" data-action="view" data-id="${full.id}">
                <a href="javascript:;" class="text-gray-800 text-hover-primary mb-1">${data}</a>
                <span>${full.email}</span>
              </div>
            `;

              return `
              <div class="symbol symbol-circle symbol-50px overflow-hidden me-3" data-action="view" data-id="${full.id}">
                <a href="javascript:;">
                  ${symbolLabel}
                </a>
              </div>
              ${nameAndEmail}
            `;
            }
          },
          {
            title: 'Role', data: 'role', render: function (data, type, row) {
              const roleName = row.roles[0]?.name;
              return roleName || '';
            },
            orderData: [1],
            orderSequence: ['asc', 'desc'],
            type: 'string',
          },
          {
            title: 'Last Login', data: 'last_login_at', render: (data, type, full) => {
              const date = data || full.created_at;
              const dateString = moment(date).fromNow();
              return `<div class="badge badge-light fw-bold">${dateString}</div>`;
            }
          },
          {
            title: 'Joined Date', data: 'created_at', render: function (data) {
              return moment(data).format('DD MMM YYYY, hh:mm a');;
            }
          }
        ],
        createdRow: function (row, data, dataIndex) {
          $('td:eq(0)', row).addClass('d-flex align-items-center');
        },
      };
    });
  }

  deleteUser(user_id: number) {
    this.route.params.subscribe(params => {
      const role_id = params['id'];
      // this.apiService.delete(role_id, user_id).subscribe(() => {
      //   this.reloadEvent.emit(true);
      // });
    });
  }

}
