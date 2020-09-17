import requests
import os

class BitrixIntegrator():

    def __init__(self):

        self.main_url = os.environ.get('BITRIX_KEY')
        self.users_dict = {}
        self.user_id_dict = {}
        self.id_list = []

    def build_query(self, method, filterParam = None, selectParam = None):

        pre_final_query = f'{self.main_url}/{method}?'
        if filterParam:
            filter_query = '&'.join([f'filter[{f[0]}]={f[1]}' for f in filterParam])
        if selectParam:
            select_query = 'select=' + '&'.join([field for field in selectParam])
        if selectParam and filterParam:
            final_query = filter_query+'&'+select_query
            return pre_final_query+final_query
        elif filterParam:
            return pre_final_query+filter_query
        else:
            return pre_final_query+select_query if selectParam else pre_final_query

    def execute_method(self, method, filterParam = None, selectParam = None):

        request_url = self.build_query(method, filterParam, selectParam)
        request = requests.get(request_url)
        if request.status_code == 200:
            response = request.json()
            return response
        else:
            return 'Status 404'

    def get_next(self, query, start, cache):

        request = requests.get(query+f'&start={start}')
        if request.status_code == 200:
            response = request.json()
            cache.extend(response['result']['tasks'])
            next_ = response.get('next')
            if next_:
                self.get_next(query, next_, cache)
        else:
            return 'Status 404'

    def get_all_users(self, selectParam):

        method = 'user.get'
        users_list = [user for user in self.execute_method('user.get', filterParam=[['ACTIVE', True]])['result']]
        if selectParam:
            users_list = [[user[field] for field in selectParam] for user in users_list]
        return users_list

    def get_all_tasks(self, filterParam = None, selectParam = None):

        cache_tasks = []
        query = self.build_query('tasks.task.list', filterParam, selectParam)
        self.get_next(query, 0, cache_tasks)
        return cache_tasks

    def get_all_user_tasks(self, id_):

        cache_tasks = []
        query = self.build_query('tasks.task.list', filterParam=[['STATUS', '2'], ['RESPONSIBLE_ID', id_]])
        print(query)
        self.get_next(query, 0, cache_tasks)
        query = self.build_query('tasks.task.list', filterParam=[['STATUS', '3'], ['RESPONSIBLE_ID', id_]])
        self.get_next(query, 0, cache_tasks)
        return cache_tasks

    def add_task(self, fields):
        method_url = f'{self.main_url}/tasks.task.add?'
        fields = '&'.join([f'fields[{key}]={value}' for key, value in fields.items()])
        request_url = method_url + fields + '&fields[AUDITORS][0]=26'
        req = requests.get(request_url)
        return req.json()

    def get_task_by_id(self, task_id):
        method_url = f'{self.main_url}/tasks.task.get?taskId={task_id}'
        req = requests.get(method_url)
        return req.json()


if __name__ == "__main__":
    bitrix = BitrixIntegrator()
    print('Hi')
    """ fields = {'TITLE': 'Тест', 'DESCRIPTION': 'Описание тестового задания', 'RESPONSIBLE_ID': 406, 'CREATED_BY': 406, 'STATUS': 3}
    bitrix.add_task(fields) """
    #print(bitrix.users_dict)
    #print(bitrix.id_list)
    #print(bitrix.execute_method('tasks.task.getFields'))
    #NEW TASK FIELDS
    #TITLE, DESCRIPTION, PRIORITY (2, 0, 1),  STSTUS (2), CREATED_BY(406), ESPONSIBLE_ID(406)
    #req =  requests.get(url_user_task)
    #print(req.json())
    

