/*
 * @copyright 2018 Christoph Wurst <christoph@winzerhof-wurst.at>
 *
 * @author 2018 Christoph Wurst <christoph@winzerhof-wurst.at>
 *
 * @license GNU AGPL version 3 or any later version
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import Axios from '@nextcloud/axios'
import { generateUrl } from '@nextcloud/router'

export function forwardAttachment(id, attachmentId) {
	const url = generateUrl(
		'/apps/mail/api/messages/{id}/attachment/{attachmentId}/forward',
		{
			id,
			attachmentId,
		}
	)

	return Axios.get(url)
		.then((resp) => {
			return resp.data
		})
		.then(({ fileName, id }) => {
			return {
				fileName,
				id,
			}
		})

}

export function saveAttachmentToFiles(id, attachmentId, directory) {
	const url = generateUrl(
		'/apps/mail/api/messages/{id}/attachment/{attachmentId}',
		{
			id,
			attachmentId,
		}
	)

	return Axios.post(url, {
		targetPath: directory,
	})
}

export function saveAttachmentsToFiles(id, directory) {
	return saveAttachmentToFiles(id, 0, directory)
}

export function downloadAttachment(url) {
	return Axios.get(url).then((res) => res.data)
}

export const uploadLocalAttachment = (file, progress) => {
	const url = generateUrl('/apps/mail/api/attachments')
	const data = new FormData()
	const opts = {
		onUploadProgress: (prog) => progress(prog, prog.loaded, prog.total),
	}
	data.append('attachment', file)

	return Axios.post(url, data, opts)
		.then((resp) => resp.data)
		.then(({ id }) => {
			return {
				file,
				id,
			}
		})
}
