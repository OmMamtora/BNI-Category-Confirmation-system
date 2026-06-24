// js/api.js
import { db } from './firebase.js';
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
  runTransaction
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

/* ══════════════════════════════════════════════════════════════════
   MEMBERS
══════════════════════════════════════════════════════════════════ */

export async function getMembers() {
  const snap = await getDocs(query(collection(db, 'members'), orderBy('name')));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function getPendingMembers() {
  const members = await getMembers();
  return members.filter(m => !m.isSubmitted);
}

export async function addMember(data) {
  return await addDoc(collection(db, 'members'), {
    name        : data.name,
    businessName: data.businessName || '',
    mobile      : data.mobile || '',
    email       : data.email || '',
    chapter     : data.chapter || 'BNI Lakshya',
    isSubmitted : data.isSubmitted ?? false,
    createdAt   : serverTimestamp()
  });
}

export async function deleteMember(memberId) {
  return await deleteDoc(doc(db, 'members', memberId));
}

export async function updateMemberSubmissionStatus(memberId, isSubmitted) {
  return await updateDoc(doc(db, 'members', memberId), { isSubmitted });
}

/* ══════════════════════════════════════════════════════════════════
   SUBMISSIONS
══════════════════════════════════════════════════════════════════ */

export async function getSubmissions() {
  const snap = await getDocs(query(collection(db, 'submissions'), orderBy('submittedAt', 'desc')));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function saveSubmission(data) {

  if (!data.memberId) {
    throw new Error('No member selected. Please go back and select your name.');
  }

  const memberRef = doc(db, 'members', data.memberId);

  // Pre-allocate the submission doc ID so we can write it inside the transaction.
  const submissionRef = doc(collection(db, 'submissions'));

  await runTransaction(db, async (transaction) => {

    const memberSnap = await transaction.get(memberRef);

    if (!memberSnap.exists()) {
      throw new Error('This member no longer exists. Please refresh and try again.');
    }

    // Re-check isSubmitted INSIDE the transaction — this is what actually
    // stops two people submitting for the same name at the same time.
    if (memberSnap.data().isSubmitted === true) {
      throw new Error('This member has already submitted a category confirmation. Please refresh and select a different name.');
    }

    transaction.set(submissionRef, {
      memberId           : data.memberId,
      memberName         : data.memberName,
      businessName       : data.businessName || '',
      chapter            : data.chapter || 'BNI Lakshya',
      category           : data.category,
      includes           : data.includes,
      excludes           : data.excludes,
      specificAsk        : data.specificAsk || '',
      declarationAccepted: data.declarationAccepted === true,
      submittedAt        : serverTimestamp()
    });

    // Lock the member in the SAME transaction so the check above
    // and this write are atomic — no window for a second submission to sneak in.
    transaction.update(memberRef, { isSubmitted: true });

  });

  return submissionRef;
}

export async function updateSubmission(submissionId, updatedData) {
  return await updateDoc(doc(db, 'submissions', submissionId), {
    ...updatedData,
    updatedAt: serverTimestamp()
  });
}

export async function deleteSubmission(submissionId, memberId = null) {
  if (memberId) {
    await updateMemberSubmissionStatus(memberId, false);
  }
  return await deleteDoc(doc(db, 'submissions', submissionId));
}

/* ══════════════════════════════════════════════════════════════════
   MISSING NAME REQUESTS
══════════════════════════════════════════════════════════════════ */

export async function getMissingRequests() {

    const snapshot = await getDocs(
        collection( db,'missingNameRequests'));

    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));

}

export async function saveRequest(data) {
    console.log("Data received:", data);
  return await addDoc(collection(db, 'missingNameRequests'), {
    fullName          : data.fullName,
    businessName      : data.businessName || '',
    mobile            : data.mobile || '',
    email             : data.email || '',
    suggestedCategory : data.suggestedCategory || '',
    message           : data.message || '',
    status            : 'pending',
    createdAt         : serverTimestamp()
  });
}



// export async function approveMissingRequest(request) {
//   await addMember({
//     name        : request.fullName,
//     businessName: request.businessName,
//     mobile      : request.mobile,
//     email       : request.email,
//     chapter     : 'BNI Lakshya',
//     isSubmitted : true
//   });

//   // Remove the request entirely so it no longer counts toward
//   // "Pending Name Requests" and disappears from the Name Requests tab
//   await deleteDoc(doc(db, 'missingNameRequests', request.id));
// }
// export async function approveMissingRequest(request) {

//   console.log("Approve Started");

//   const memberRef = await addMember({
//     name: request.fullName,
//     businessName: request.businessName,
//     mobile: request.mobile,
//     email: request.email,
//     chapter: 'BNI Lakshya',
//     isSubmitted: true
//   });

//   console.log("Member Added:", memberRef.id);

//   await deleteDoc(doc(db, 'missingNameRequests', request.id));

//   console.log("Request Deleted");
// }

export async function approveMissingRequest(request) {

  await addMember({
    name: request.fullName,
    businessName: request.businessName,
    mobile: request.mobile,
    email: request.email,
    chapter: 'BNI Lakshya',
    isSubmitted: false
  });

  await deleteDoc(doc(db, 'missingNameRequests', request.id));
}

export async function deleteRequest(requestId) {
  return await deleteDoc(doc(db, 'missingNameRequests', requestId));
}

/* ══════════════════════════════════════════════════════════════════
   DASHBOARD STATS
══════════════════════════════════════════════════════════════════ */

export async function getDashboardStats() {
  const [members, submissions, requests] = await Promise.all([
    getMembers(),
    getSubmissions(),
    getMissingRequests()
  ]);

  const pendingCount = members.filter(m => !m.isSubmitted).length;
  const requestCount = requests.filter(r => r.status === 'pending').length;

  return {
    totalMembers  : members.length,
    confirmedCount: submissions.length,
    pendingCount,
    requestCount
  };
}
