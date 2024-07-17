import './index.css'
import { UploadOutlined, AppstoreAddOutlined, ImportOutlined } from '@ant-design/icons'
import type { UploadProps } from 'antd'
import { Button, Upload, notification } from 'antd'
import { useState } from 'react'
import readXlsxFile from 'read-excel-file'
import { useAuthenticatedFetch } from '../../hooks/useAuthenticatedFetch'
import { useUserStore } from '../../store/user'

const schema = {
  'price': {
    prop: 'price',
    type: Number
  },
  'name': {
    prop: 'name',
    type: String
  },
  'R': {
    prop: 'R',
    type: Number
  },
  'G': {
    prop: 'G',
    type: Number
  },
  'B': {
    prop: 'B',
    type: Number
  }
}

function ManageColor() {
  // TODO: Add download excel example
  const accessToken = useUserStore((state) => state.accessToken)
  const authFetch = useAuthenticatedFetch()
  const [api, contextHolder] = notification.useNotification()
  const [files, setFiles] = useState<any>([])
  const props: UploadProps = {
    name: 'file',
    accept: 'xlsx',
    maxCount: 1,
    beforeUpload(file) {
      setFiles([file])
    },
    fileList: files,
  }

  const handleAddToColors = () => {
    readXlsxFile(files[0], { schema }).then((readInfo) => {
      const { rows } = readInfo

      if (!rows.length) {
        notifyWrongFormatAddColor()
        return
      }
      // TODO: add color
      setFiles([])
    })
  }

  const handleReplaceColors = () => {
    readXlsxFile(files, { schema }).then((readInfo) => {
      const { rows } = readInfo

      if (!rows.length) {
        notifyWrongFormatAddColor()
        return
      }
      // TODO: replace color
      setFiles([])
    })
  }

  const notifyWrongFormatAddColor = () => {
    api.open({
      message: 'Thêm màu thất bại',
      description:
        'File không đúng đinh dạng',
    });
  }

  return (
    <div className='ManageColor'>
      {contextHolder}
      <Upload {...props}>
        <Button icon={<UploadOutlined />}>Thêm file màu</Button>
      </Upload>

      <Button disabled={!files?.length} icon={<AppstoreAddOutlined />} onClick={handleAddToColors}>Thêm vào bảng màu</Button>
      <Button disabled={!files?.length} icon={<ImportOutlined />} onClick={handleReplaceColors} >Thay thế bảng màu</Button>
    </div>
  )
}

export default ManageColor
