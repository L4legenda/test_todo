import { useDeep, useDeepSubscription } from '@deep-foundation/deeplinks/imports/client';
import { useEffect, useState } from 'react';
import { Task } from '../components/Task';


export default function Home() {
  const [nameBoard, setNameBoard] = useState("")
  const [idBoard, setIdBoard] = useState(0)
  const [idNameBoard, setIdNameBoard] = useState(0)
  const [idTask, setIdTask] = useState(0)
  const [idContain, setIdContain] = useState(0)
  const deep = useDeep();

  useEffect(() => {
    const f = async () => {
      setIdBoard(await deep.id("@l4legenda/tasks", "Board"))
      setIdNameBoard(await deep.id("@l4legenda/tasks", "BoardName"))
      setIdTask(await deep.id("@deep-foundation/tasks", "Task"))
      setIdContain(await deep.id("@deep-foundation/core", "Contain"))
    }

    f();
  }, [])

  useDeepSubscription({
    type_id: {
      _in: [idBoard, idNameBoard, idTask, idContain]
    },
  })

  const handlerCreateBoard = async () => {
    const [ReserveId] = await deep.reserve(1);

    deep.insert({
      id: ReserveId,
      type_id: await deep.id("@l4legenda/tasks", "Board"),
      in: {
        data: {
          type_id: await deep.id("@l4legenda/tasks", "BoardName"),
          string: { data: { value: nameBoard } },
          from_id: ReserveId,
        }
      }
    })
  }

  const handlerChangeTask = async (v: any, BoardId: any, TaskId: any) => {
    await deep.update({ link_id: TaskId }, { value: v }, { table: 'strings' })
  }

  const handlerInsertTask = async (e: any, BoardId: any) => {

    await deep.insert({
      type_id: await deep.id("@deep-foundation/tasks", "Task"),
      string: { data: { value: "" } },
      in: {
        data: {
          type_id: await deep.id("@deep-foundation/core", "Contain"),
          from_id: BoardId,
        }
      }
    })

  }

  const handlerInsertSplitTask = async (taskId: number, boardId: number) => {

    const splitLink = await deep.insert({
      type_id: await deep.id("@deep-foundation/chatgpt-tasks", "Split"),
      from_id: taskId,
      to_id: taskId,
    });

    await deep.await(splitLink.data?.[0].id);

    const { data: [{ id: firstTask }, { id: secondTask }] } = await deep.select({
      type_id: {
        _id: ['@deep-foundation/tasks', 'Task']
      },
      in: {
        type_id: {
          _id: ['@deep-foundation/tasks', 'DependsOn']
        },
        from_id: taskId
      }
    })

    await deep.insert([
      {
      type_id: await deep.id("@deep-foundation/core", "Contain"),
      from_id: boardId,
      to_id: firstTask,
    },
    {
      type_id: await deep.id("@deep-foundation/core", "Contain"),
      from_id: boardId,
      to_id: secondTask,
    },
  ]);

  }

  return (
    <div>
      <input type="text" value={nameBoard} onInput={(e: any) => { setNameBoard(e.target.value) }} />
      <button onClick={handlerCreateBoard}>Create Board</button>
      {deep.minilinks.byType[idBoard]?.map((value, index) => {
        return <div key={index}>
          <div>Board {value.inByType[idNameBoard]?.[0]?.string?.value}</div>
          <div>
            {value.outByType?.[idContain]?.map((valueContainTask, indexTask) => {
              const valueTask = valueContainTask.to;
              return <Task
                key={indexTask}
                value={valueTask?.string?.value}
                onChange={(v: string) => handlerChangeTask(v, value.id, valueTask?.id)}
                onClickSplit={(e: any) => { handlerInsertSplitTask(valueTask?.id, value?.id) }}
              />
            })}
            <button onClick={(e) => handlerInsertTask(e, value.id)}>Create task</button>
          </div>
        </div>
      })}

    </div>
  )
}
